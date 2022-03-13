export = MoneroOutputWallet;
/**
 * Models a Monero output with wallet extensions.
 *
 * @class
 * @extends {MoneroOutput}
 */
declare class MoneroOutputWallet extends MoneroOutput {
    getAccountIndex(): any;
    setAccountIndex(accountIndex: any): MoneroOutputWallet;
    getSubaddressIndex(): any;
    setSubaddressIndex(subaddressIndex: any): MoneroOutputWallet;
    isSpent(): any;
    setIsSpent(isSpent: any): MoneroOutputWallet;
    /**
     * Indicates if this output has been deemed 'malicious' and will therefore
     * not be spent by the wallet.
     *
     * @return Boolean is whether or not this output is frozen
     */
    isFrozen(): any;
    setIsFrozen(isFrozen: any): MoneroOutputWallet;
    isLocked(): any;
    copy(): MoneroOutputWallet;
    /**
     * Updates this output by merging the latest information from the given
     * output.
     *
     * Merging can modify or build references to the output given so it
     * should not be re-used or it should be copied before calling this method.
     *
     * @param output is the output to merge into this one
     */
    merge(output: any): MoneroOutputWallet;
    toString(indent: any): string;
}
import MoneroOutput = require("../../daemon/model/MoneroOutput");
