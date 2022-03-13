export = WalletSyncPrinter;
/**
 * Print sync progress every X blocks.
 */
declare class WalletSyncPrinter extends MoneroWalletListener {
    constructor(syncResolution: any);
    nextIncrement: number;
    syncResolution: any;
    onSyncProgress(height: any, startHeight: any, endHeight: any, percentDone: any, message: any): void;
}
import MoneroWalletListener = require("../../main/js/wallet/model/MoneroWalletListener");
