export = TestMoneroWalletFull;
/**
 * Tests a Monero wallet using WebAssembly to bridge to monero-project's wallet2.
 */
declare class TestMoneroWalletFull extends TestMoneroWalletCommon {
    static _getRandomWalletPath(): string;
    static _testWalletEqualityOnChain(wallet1: any, wallet2: any): Promise<void>;
    constructor(testConfig: any);
    beforeAll(currentTest: any): Promise<void>;
    beforeEach(currentTest: any): Promise<void>;
    afterEach(currentTest: any): Promise<void>;
    getTestWallet(): Promise<MoneroWalletFull>;
    openWallet(config: any, startSyncing: any): Promise<MoneroWalletFull>;
    createWallet(config: any, startSyncing: any): Promise<MoneroWalletFull>;
    getWalletGt(): Promise<any>;
    closeWallet(wallet: any, save: any): Promise<void>;
    getMnemonicLanguages(): Promise<any>;
    runTests(): void;
    _testWalletFull(): void;
}
import TestMoneroWalletCommon = require("./TestMoneroWalletCommon");
