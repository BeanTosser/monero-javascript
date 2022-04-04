export = TestMoneroWalletKeys;
/**
 * Tests the implementation of MoneroWallet which only manages keys using WebAssembly.
 */
declare class TestMoneroWalletKeys extends TestMoneroWalletCommon {
    constructor(config: any);
    beforeAll(currentTest: any): Promise<void>;
    beforeEach(currentTest: any): Promise<void>;
    afterEach(currentTest: any): Promise<void>;
    getTestWallet(): Promise<MoneroWalletKeys>;
    openWallet(config: any): Promise<void>;
    createWallet(config: any): Promise<MoneroWalletKeys>;
    closeWallet(wallet: any, save: any): Promise<void>;
    getMnemonicLanguages(): Promise<any>;
    runTests(): void;
    _testWalletKeys(): void;
}
import TestMoneroWalletCommon = require("./TestMoneroWalletCommon");
