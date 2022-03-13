export = TestUtils;
/**
 * Collection of test utilities and configurations.
 *
 * TODO: move hard coded to config
 */
declare class TestUtils {
    /**
     * Get a default file system.  Uses an in-memory file system if running in the browser.
     *
     * @return nodejs-compatible file system
     */
    static getDefaultFs(): any;
    /**
     * Get a singleton daemon RPC instance shared among tests.
     *
     * @return {MoneroDaemonRpc} a daemon RPC instance
     */
    static getDaemonRpc(): MoneroDaemonRpc;
    /**
     * Get a singleton instance of a monero-daemon-rpc client.
     */
    static getDaemonRpcConnection(): import("../../main/js/common/MoneroRpcConnection");
    /**
     * Get a singleton instance of a monero-wallet-rpc client.
     *
     * @return {MoneroWalletRpc} a wallet RPC instance
     */
    static getWalletRpc(): typeof import("../../main/js/wallet/MoneroWalletRpc");
    /**
     * Create a monero-wallet-rpc process bound to the next available port.
     *
     * @return {Promise<MoneroWalletRpc>} - client connected to an internal monero-wallet-rpc instance
     */
    static startWalletRpcProcess(): Promise<typeof import("../../main/js/wallet/MoneroWalletRpc")>;
    /**
     * Stop a monero-wallet-rpc process and release its port.
     *
     * @param {MoneroWalletRpc} walletRpc - wallet created with internal monero-wallet-rpc process
     */
    static stopWalletRpcProcess(walletRpc: typeof import("../../main/js/wallet/MoneroWalletRpc")): Promise<void>;
    /**
     * Get a singleton instance of a wallet supported by WebAssembly bindings to monero-project's wallet2.
     *
     * @return {MoneroWalletFull} a full wallet instance
     */
    static getWalletFull(): MoneroWalletFull;
    /**
     * Get a singleton keys-only wallet instance shared among tests.
     *
     * @return {MoneroWalletKeys} a keys-only wallet instance
     */
    static getWalletKeys(): MoneroWalletKeys;
    static testUnsignedBigInteger(num: any, nonZero: any): void;
    static getExternalWalletAddress(): Promise<any>;
    static txsMergeable(tx1: any, tx2: any): boolean;
}
declare namespace TestUtils {
    export const MONERO_BINS_DIR: string;
    export const WALLET_NAME: string;
    export const WALLET_PASSWORD: string;
    export const TEST_WALLETS_DIR: string;
    export const WALLET_FULL_PATH: string;
    export const MAX_FEE: any;
    export const NETWORK_TYPE: number;
    export const MNEMONIC: string;
    export const ADDRESS: string;
    export const FIRST_RECEIVE_HEIGHT: number;
    export namespace WALLET_RPC_CONFIG {
        const uri: string;
        const username: string;
        const password: string;
        const rejectUnauthorized: boolean;
    }
    export const DAEMON_LOCAL_PATH: string;
    export namespace DAEMON_RPC_CONFIG {
        const uri_1: string;
        export { uri_1 as uri };
        const username_1: string;
        export { username_1 as username };
        const password_1: string;
        export { password_1 as password };
        const rejectUnauthorized_1: boolean;
        export { rejectUnauthorized_1 as rejectUnauthorized };
    }
    export const WALLET_TX_TRACKER: WalletTxTracker;
    export const PROXY_TO_WORKER: boolean;
    export const SYNC_PERIOD_IN_MS: number;
    export const WALLET_RPC_PORT_START: number;
    export const WALLET_PORT_OFFSETS: {};
    export const WALLET_RPC_LOCAL_PATH: string;
    import WALLET_RPC_LOCAL_WALLET_DIR = MONERO_BINS_DIR;
    export { WALLET_RPC_LOCAL_WALLET_DIR };
    export const WALLET_RPC_ACCESS_CONTROL_ORIGINS: string;
}
import WalletTxTracker = require("./WalletTxTracker");
