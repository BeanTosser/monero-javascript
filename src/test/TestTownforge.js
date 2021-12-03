const assert = require("assert");
const monerojs = require("../../index");
const LibraryUtils = monerojs.LibraryUtils;
const TownforgeUtils = monerojs.TownforgeUtils;

/**
 * Test Townforge JavaScript API.
 */
class TestTownforge {
  
  runTests() {
    describe("Test Townforge", function() {
      let that = this;
      let wallet;
      
      // tasks before tests
      before(async function() {
        await LibraryUtils.loadTownforgeModule();
      });
      
      // tasks after tests
      after(async function() {
        
      });
      
      it("Can run Townforge", async function() {
        let response = TownforgeUtils.startTownforge();
        assert.equal("", response); // return string if there was an error
      });
    });
  }
}

module.exports = TestTownforge;