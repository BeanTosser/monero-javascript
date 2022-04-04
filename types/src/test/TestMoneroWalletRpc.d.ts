export = TestMoneroWalletRpc;
/**
 * Tests the Monero Wallet RPC client and server.
 */
declare class TestMoneroWalletRpc extends TestMoneroWalletCommon {
    constructor(testConfig: any);
    beforeEach(currentTest: any): Promise<void>;
    afterEach(currentTest: any): Promise<void>;
    getTestWallet(): Promise<typeof import("../main/js/wallet/MoneroWalletRpc")>;
    openWallet(config: any): Promise<typeof import("../main/js/wallet/MoneroWalletRpc")>;
    createWallet(config: any): Promise<typeof import("../main/js/wallet/MoneroWalletRpc")>;
    closeWallet(wallet: any, save: any): Promise<void>;
    getMnemonicLanguages(): Promise<any>;
    runTests(): void;
    _testTxWallet(tx: any, ctx: any): Promise<void>;
    _testWalletRpc(testConfig: any): void;
}
import TestMoneroWalletCommon = require("./TestMoneroWalletCommon");
