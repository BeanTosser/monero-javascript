import assert from "assert";
import GenUtils from "./GenUtils";
import MoneroError from "./MoneroError";
import ThreadPool from "./ThreadPool";
import path from "path";

/**
 * Collection of helper utilities for the library.
 * 
 * @hideconstructor
 */
class LibraryUtils {
  
  /**
   * Log a message.
   *
   * @param {number} level - log level of the message
   * @param {string} msg - message to log
   */
  static log(level, msg) {
    assert(level === parseInt(level, 10) && level >= 0, "Log level must be an integer >= 0");
    if (LibraryUtils.LOG_LEVEL >= level) console.log(msg);
  }
  
  /**
   * Set the library's log level with 0 being least verbose.
   *
   * @param {number} level - the library's log level
   */
  static async setLogLevel(level) {
    console.log("set log level 1");
    assert(level === parseInt(level, 10) && level >= 0, "Log level must be an integer >= 0");
    console.log("set log level 2");
    LibraryUtils.LOG_LEVEL = level;
    console.log("set log level 3");
    try{
      if (LibraryUtils.WORKER) await LibraryUtils.invokeWorker(GenUtils.getUUID(), "setLogLevel", [level]);
    }catch(e){
      console.log("Failed to invoke worker: " + e);
    }
    console.log("set log level 4");
  }
  
  /**
   * Get the library's log level.
   *
   * @return {int} the library's log level
   */
  static getLogLevel() {
    return LibraryUtils.LOG_LEVEL;
  }
  
  /**
   * Get the total memory used by WebAssembly.
   * 
   * @return {int} the total memory used by WebAssembly
   */
  static async getWasmMemoryUsed() {
    let total = 0;
    if (LibraryUtils.WORKER) total += await LibraryUtils.invokeWorker(GenUtils.getUUID(), "getWasmMemoryUsed", []);
    if (LibraryUtils.getWasmModule() && LibraryUtils.getWasmModule().HEAP8) total += LibraryUtils.getWasmModule().HEAP8.length;
    return total;
  }
  
  /**
   * Get the WebAssembly module in the current context (nodejs, browser main thread or worker).
   */
  static getWasmModule() {
    return LibraryUtils.WASM_MODULE;
  }
  
  /**
   * Load the WebAssembly keys module with caching.
   */
  static async loadKeysModule() {
    
    // use cache if suitable, full module supersedes keys module because it is superset
    if (LibraryUtils.WASM_MODULE) return LibraryUtils.WASM_MODULE;
    
    // load module
    delete LibraryUtils.WASM_MODULE;
    LibraryUtils.WASM_MODULE = require("../../../../dist/monero_wallet_keys")();
    return new Promise(function(resolve, reject) {
      LibraryUtils.WASM_MODULE.then(module => {
        LibraryUtils.WASM_MODULE = module
        delete LibraryUtils.WASM_MODULE.then;
        LibraryUtils._initWasmModule(LibraryUtils.WASM_MODULE);
        resolve(LibraryUtils.WASM_MODULE);
      });
    });
  }
  
  /**
   * Load the WebAssembly full module with caching.
   * 
   * The full module is a superset of the keys module and overrides it.
   * 
   * TODO: this is separate static function from loadKeysModule() because webpack cannot bundle worker using runtime param for conditional import
   */
  static async loadFullModule() {
    
    // use cache if suitable, full module supersedes keys module because it is superset
    if (LibraryUtils.WASM_MODULE && LibraryUtils.FULL_LOADED) return LibraryUtils.WASM_MODULE;
    
    // load module
    delete LibraryUtils.WASM_MODULE;
    LibraryUtils.WASM_MODULE = require("../../../../dist/monero_wallet_full")();
    return new Promise(function(resolve, reject) {
      LibraryUtils.WASM_MODULE.then(module => {
        LibraryUtils.WASM_MODULE = module
        delete LibraryUtils.WASM_MODULE.then;
        LibraryUtils.FULL_LOADED = true;
        LibraryUtils._initWasmModule(LibraryUtils.WASM_MODULE);
        resolve(LibraryUtils.WASM_MODULE);
      });
    });
  }
  
  /**
   * Register a function by id which informs if unauthorized requests (e.g.
   * self-signed certificates) should be rejected.
   * 
   * @param {string} fnId - unique identifier for the function
   * @param {function} fn - function to inform if unauthorized requests should be rejected
   */
  static setRejectUnauthorizedFn(fnId, fn) {
    if (!LibraryUtils.REJECT_UNAUTHORIZED_FNS) LibraryUtils.REJECT_UNAUTHORIZED_FNS = [];
    if (fn === undefined) delete LibraryUtils.REJECT_UNAUTHORIZED_FNS[fnId];
    else LibraryUtils.REJECT_UNAUTHORIZED_FNS[fnId] = fn;
  }
  
  /**
   * Indicate if unauthorized requests should be rejected.
   * 
   * @param {string} fnId - uniquely identifies the function
   */
  static isRejectUnauthorized(fnId) {
    if (!LibraryUtils.REJECT_UNAUTHORIZED_FNS[fnId]) throw new Error("No function registered with id " + fnId + " to inform if unauthorized reqs should be rejected");
    return LibraryUtils.REJECT_UNAUTHORIZED_FNS[fnId]();
  }
  
  /**
   * Set the path to load the worker. Defaults to "/monero_web_worker.js" in the browser
   * and "./MoneroWebWorker.js" in node.
   * 
   * @param {string} workerDistPath - path to load the worker
   */
  static setWorkerDistPath(workerDistPath) {
    let path = LibraryUtils._prefixWindowsPath(workerDistPath ? workerDistPath : LibraryUtils.WORKER_DIST_PATH_DEFAULT);
    if (path !== LibraryUtils.WORKER_DIST_PATH) delete LibraryUtils.WORKER;
    LibraryUtils.WORKER_DIST_PATH = path;
  }

  /**
   * Get a singleton instance of a worker to share.
   * 
   * @return {Worker} a worker to share among wallet instances
   */
  static async getWorker() {
    console.log("LibraryUtils.getWorker");
    // one time initialization
    if (!LibraryUtils.WORKER) {
      console.log("New worker");
      if (GenUtils.isBrowser()) {
        LibraryUtils.WORKER = new Worker(LibraryUtils.WORKER_DIST_PATH);
        console.log("Dooby 1");
      } else {
        const Worker = require("web-worker"); // import web worker if nodejs
        console.log("Import worker");
        LibraryUtils.WORKER = new Worker(LibraryUtils.WORKER_DIST_PATH);
        console.log("Imported worker");
      }
      LibraryUtils.WORKER_OBJECTS = {};  // store per object running in the worker
      
      // receive worker errors
      LibraryUtils.WORKER.onerror = function(err) {
        console.error("Error posting message to MoneroWebWorker.js; is it copied to the app's build directory (e.g. in the root)?");
        console.log(err);
      };
      
      // receive worker messages
      console.log("Setting utils.WORKER.onmessage");
      LibraryUtils.WORKER.onmessage = function(e) {
        
        // lookup object id, callback function, and this arg
        let thisArg = null;
        let callbackFn = LibraryUtils.WORKER_OBJECTS[e.data[0]].callbacks[e.data[1]]; // look up by object id then by function name
        if (callbackFn === undefined) throw new Error("No worker callback function defined for key '" + e.data[1] + "'");
        if (callbackFn instanceof Array) {  // this arg may be stored with callback function
          thisArg = callbackFn[1];
          callbackFn = callbackFn[0];
        }
        
        // invoke callback function with this arg and arguments
        callbackFn.apply(thisArg, e.data.slice(2));
      }
      console.log("Set onmessage");
      
      // set worker log level
      console.log("Setting log level");
      await LibraryUtils.setLogLevel(LibraryUtils.getLogLevel());
      console.log("set log level");
    }
    return LibraryUtils.WORKER;
  }
  
  /**
   * Invoke a worker function and get the result with error handling.
   * 
   * @param {objectId} identifies the worker object to invoke
   * @param {string} fnName is the name of the function to invoke
   * @param {Object[]} args are function arguments to invoke with
   * @return {Promise} resolves with response payload from the worker or an error
   */
  static async invokeWorker(objectId, fnName, args) {
    console.log("invoke worker");
    console.log("")
    console.log("")
    console.log("")
    assert(fnName.length >= 2);
    console.log("step 1");
    let worker;
    try{
      worker = await LibraryUtils.getWorker();
    } catch(e){
      console.log("Failed to get worker: " + e);
    }
    console.log("worker from LibraryUtils: " + worker);
    console.log("step 2");
    if (!LibraryUtils.WORKER_OBJECTS[objectId]) LibraryUtils.WORKER_OBJECTS[objectId] = {callbacks: {}};
    console.log("step 3");
    return new Promise(function(resolve, reject) {
      console.log("promise step 1");
      let callbackId = GenUtils.getUUID();
      console.log("promise step 2");
      LibraryUtils.WORKER_OBJECTS[objectId].callbacks[callbackId] = function(resp) {  // TODO: this defines function once per callback
        console.log("metacallback step 1");
        resp ? (resp.error ? reject(new MoneroError(resp.error)) : resolve(resp.result)) : resolve();
      };
      console.log("promise step 3")
      worker.postMessage([objectId, fnName, callbackId].concat(args === undefined ? [] : GenUtils.listify(args)));
      console.log("promise step 4");
    });
  }
  
  // ------------------------------ PRIVATE HELPERS ---------------------------
  
  static _initWasmModule(wasmModule) {
    wasmModule.taskQueue = new ThreadPool(1);
    wasmModule.queueTask = async function(asyncFn) { return wasmModule.taskQueue.submit(asyncFn); }
  }
  
  static _prefixWindowsPath(path) {
    if (path.indexOf("C:") == 0 && path.indexOf("file://") == -1) path = "file://" + path; // prepend C: paths with file://
    return path;
  }
}

LibraryUtils.LOG_LEVEL = 0;
LibraryUtils.WORKER_DIST_PATH_DEFAULT = GenUtils.isBrowser() ? "/monero_web_worker.js" : function() {
    return LibraryUtils._prefixWindowsPath(path.join(__dirname, "./MoneroWebWorker.js"));
}();
LibraryUtils.WORKER_DIST_PATH = LibraryUtils.WORKER_DIST_PATH_DEFAULT;

export default LibraryUtils;
