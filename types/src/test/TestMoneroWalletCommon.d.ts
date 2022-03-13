export = TestMoneroWalletCommon;
/**
 * Test a wallet for common functionality.
 */
declare class TestMoneroWalletCommon {
    /**
     * Construct the tester.
     *
     * @param {object} testConfig - test configuration
     */
    constructor(testConfig: object);
    testConfig: any;
    /**
     * Called before all wallet tests.
     */
    beforeAll(): Promise<void>;
    wallet: void;
    daemon: MoneroDaemonRpc;
    /**
     * Called before each wallet test.
     *
     @param {object} currentTest - invoked with Mocha current test
     */
    beforeEach(currentTest: object): Promise<void>;
    /**
     * Called after all wallet tests.
     */
    afterAll(): Promise<void>;
    /**
     * Called after each wallet test.
     *
     @param {object} currentTest - invoked with Mocha current test
     */
    afterEach(currentTest: object): Promise<void>;
    /**
     * Get the daemon to test.
     *
     * @return the daemon to test
     */
    getTestDaemon(): Promise<MoneroDaemonRpc>;
    /**
     * Get the main wallet to test.
     *
     * @return the wallet to test
     */
    getTestWallet(): Promise<void>;
    /**
     * Open a test wallet with default configuration for each wallet type.
     *
     * @param config - configures the wallet to open
     * @return MoneroWallet is the opened wallet
     */
    openWallet(config: any): Promise<void>;
    /**
     * Create a test wallet with default configuration for each wallet type.
     *
     * @param config - configures the wallet to create
     * @return MoneroWallet is the created wallet
     */
    createWallet(config: any): Promise<void>;
    /**
     * Close a test wallet with customization for each wallet type.
     *
     * @param {MoneroWallet} wallet - the wallet to close
     * @param {bool} save - whether or not to save the wallet
     */
    closeWallet(wallet: typeof import("../main/js/wallet/MoneroWallet"), save: bool): Promise<void>;
    /**
     * Get the wallet's supported languages for the mnemonic phrase.  This is an
     * instance method for wallet rpc and a static utility for other wallets.
     *
     * @return {string[]} the wallet's supported languages
     */
    getMnemonicLanguages(): string[];
    runCommonTests(): void;
    getSubaddressesWithBalance(): Promise<any[]>;
    getSubaddressesWithUnlockedBalance(): Promise<any[]>;
    _testGetSubaddressAddressOutOfRange(): Promise<void>;
    /**
     * Fetches and tests transactions according to the given query.
     *
     * TODO: convert query to query object and ensure each tx passes filter, same with getAndTestTransfer, getAndTestOutputs
     */
    _getAndTestTxs(wallet: any, query: any, isExpected: any): Promise<any[]>;
    /**
     * Fetches and tests transfers according to the given query.
     */
    _getAndTestTransfers(wallet: any, query: any, isExpected: any): Promise<any[]>;
    /**
     * Fetches and tests outputs according to the given query.
     */
    _getAndTestOutputs(wallet: any, query: any, isExpected: any): Promise<any[]>;
    /**
     * Tests a wallet transaction with a test configuration.
     *
     * @param tx is the wallet transaction to test
     * @param ctx specifies test configuration
     *        ctx.wallet is used to cross reference tx info if available
     *        ctx.config specifies the tx's originating send configuration
     *        ctx.isSendResponse indicates if the tx is built from a send response, which contains additional fields (e.g. key)
     *        ctx.hasDestinations specifies if the tx has an outgoing transfer with destinations, undefined if doesn't matter
     *        ctx.includeOutputs specifies if outputs were fetched and should therefore be expected with incoming transfers
     */
    _testTxWallet(tx: any, ctx: any): Promise<void>;
    _testTxWalletCopy(tx: any, ctx: any): Promise<void>;
    _testMultisig(m: any, n: any, testTx: any): Promise<void>;
    _testMultisigParticipants(participants: any, m: any, n: any, testTx: any): Promise<void>;
    _synchronizeMultisigParticipants(wallets: any): Promise<void>;
    _testMultisigInfo(info: any, m: any, n: any): Promise<void>;
    _testViewOnlyAndOfflineWallets(viewOnlyWallet: any, offlineWallet: any): Promise<void>;
    _testInvalidAddressError(err: any): void;
    _testInvalidTxHashError(err: any): void;
    _testInvalidTxKeyError(err: any): void;
    _testInvalidSignatureError(err: any): void;
    _testNoSubaddressError(err: any): void;
    _testSignatureHeaderCheckError(err: any): void;
}
