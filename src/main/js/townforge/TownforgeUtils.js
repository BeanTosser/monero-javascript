const LibraryUtils = require("../common/LibraryUtils");
const MoneroError = require("../common/MoneroError");

/**
 * Collection of Townforge utilities.
 * 
 * @hideconstructor
 */
class TownforgeUtils {
    
  /**
   * <p>Proof of concept to run Townforge source from the browser.<p>
   * 
   * @param {string} config - starting configuration
   * @@return {Promise<string>} the response from the Townforge wasm module
   */
  static startTownforge(config) {
    
    // wasm module must be preloaded
    if (LibraryUtils.getWasmModule() === undefined) throw new MoneroError("WASM module is not loaded; call 'await LibraryUtils.loadTownforgeModule()' to load");
    
    // run townforge source
    let err = LibraryUtils.getWasmModule().start_townforge(config ? config : "");
    if (err) throw new Error(err);
  }
}

module.exports = TownforgeUtils;