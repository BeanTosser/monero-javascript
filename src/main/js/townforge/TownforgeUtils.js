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
   * @return {string} the response from the Townforge wasm module
   */
  static startTownforge() {
    
    // wasm module must be preloaded
    if (LibraryUtils.getWasmModule() === undefined) throw new MoneroError("WASM module is not loaded; call 'await LibraryUtils.loadTownforgeModule()' to load");
    
    // run townforge source
    return LibraryUtils.getWasmModule().start_townforge();
  }
}

module.exports = TownforgeUtils;