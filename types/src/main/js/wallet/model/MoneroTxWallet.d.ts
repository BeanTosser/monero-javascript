export = MoneroTxWallet;
/**
 * Models a Monero transaction with wallet extensions.
 *
 * @class
 * @extends {MoneroTx}
 */
declare class MoneroTxWallet extends MoneroTx {
    static _mergeIncomingTransfer(transfers: any, transfer: any): void;
    getTxSet(): any;
    setTxSet(txSet: any): MoneroTxWallet;
    isIncoming(): any;
    setIsIncoming(isIncoming: any): MoneroTxWallet;
    isOutgoing(): any;
    setIsOutgoing(isOutgoing: any): MoneroTxWallet;
    getIncomingAmount(): BigInteger;
    getOutgoingAmount(): any;
    getTransfers(transferQuery: any): any[];
    filterTransfers(transferQuery: any): any[];
    getIncomingTransfers(): any;
    setIncomingTransfers(incomingTransfers: any): MoneroTxWallet;
    getOutgoingTransfer(): any;
    setOutgoingTransfer(outgoingTransfer: any): MoneroTxWallet;
    getInputs(outputQuery: any): any;
    setInputs(inputs: any): MoneroTxWallet;
    getOutputs(outputQuery: any): any;
    setOutputs(outputs: any): MoneroTxWallet;
    filterOutputs(outputQuery: any): any[];
    getNote(): any;
    setNote(note: any): MoneroTxWallet;
    isLocked(): any;
    setIsLocked(isLocked: any): MoneroTxWallet;
    getInputSum(): any;
    setInputSum(inputSum: any): MoneroTxWallet;
    getOutputSum(): any;
    setOutputSum(outputSum: any): MoneroTxWallet;
    getChangeAddress(): any;
    setChangeAddress(changeAddress: any): MoneroTxWallet;
    getChangeAmount(): any;
    setChangeAmount(changeAmount: any): MoneroTxWallet;
    getNumDummyOutputs(): any;
    setNumDummyOutputs(numDummyOutputs: any): MoneroTxWallet;
    getExtraHex(): any;
    setExtraHex(extraHex: any): MoneroTxWallet;
    copy(): MoneroTxWallet;
    /**
     * Updates this transaction by merging the latest information from the given
     * transaction.
     *
     * Merging can modify or build references to the transaction given so it
     * should not be re-used or it should be copied before calling this method.
     *
     * @param tx is the transaction to merge into this transaction
     */
    merge(tx: any): MoneroTxWallet;
    toString(indent: number, oneLine: any): string;
}
import MoneroTx = require("../../daemon/model/MoneroTx");
import BigInteger_1 = require("../../common/biginteger");
import BigInteger = BigInteger_1.BigInteger;
