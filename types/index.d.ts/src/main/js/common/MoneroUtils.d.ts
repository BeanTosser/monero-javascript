export = MoneroUtils;
/**
 * Collection of Monero utilities.
 *
 * @hideconstructor
 */
declare class MoneroUtils {
    /**
     * <p>Get the version of the monero-javascript library.<p>
     *
     * @return {string} the version of this monero-javascript library
     */
    static getVersion(): string;
    /**
     * Validate the given mnemonic, throw an error if invalid.
     *
     * TODO: improve validation, use network type
     *
     * @param {string} mnemonic - mnemonic to validate
     */
    static validateMnemonic(mnemonic: string): void;
    /**
     * Indicates if a private view key is valid.
     *
     * @param {string} privateViewKey is the private view key to validate
     * @return {bool} true if the private view key is valid, false otherwise
     */
    static isValidPrivateViewKey(privateViewKey: string): bool;
    /**
     * Indicates if a public view key is valid.
     *
     * @param {string} publicViewKey is the public view key to validate
     * @return {bool} true if the public view key is valid, false otherwise
     */
    static isValidPublicViewKey(publicViewKey: string): bool;
    /**
     * Indicates if a private spend key is valid.
     *
     * @param {string} privateSpendKey is the private spend key to validate
     * @return {bool} true if the private spend key is valid, false otherwise
     */
    static isValidPrivateSpendKey(privateSpendKey: string): bool;
    /**
     * Indicates if a public spend key is valid.
     *
     * @param {string} publicSpendKey is the public spend key to validate
     * @return {bool} true if the public spend key is valid, false otherwise
     */
    static isValidPublicSpendKey(publicSpendKey: string): bool;
    /**
     * Validate the given private view key, throw an error if invalid.
     *
     * @param {string} privateViewKey - private view key to validate
     */
    static validatePrivateViewKey(privateViewKey: string): void;
    /**
     * Validate the given public view key, throw an error if invalid.
     *
     * @param {string} publicViewKey - public view key to validate
     */
    static validatePublicViewKey(publicViewKey: string): void;
    /**
     * Validate the given private spend key, throw an error if invalid.
     *
     * @param {string} privateSpendKey - private spend key to validate
     */
    static validatePrivateSpendKey(privateSpendKey: string): void;
    /**
     * Validate the given public spend key, throw an error if invalid.
     *
     * @param {string} publicSpendKey - public spend key to validate
     */
    static validatePublicSpendKey(publicSpendKey: string): void;
    /**
     * Get an integrated address.
     *
     * @param {MoneroNetworkType} networkType - network type of the integrated address
     * @param {string} standardAddress - primary address or subaddress for the integrated address
     * @param {string} [paymentId] - optionally specifies the integrated address's payment id (defaults to random payment id)
     * @return {MoneroIntegratedAddress} the integrated address
     */
    static getIntegratedAddress(networkType: MoneroNetworkType, standardAddress: string, paymentId?: string): MoneroIntegratedAddress;
    /**
     * Determine if the given address is valid.
     *
     * @param {string} address - address
     * @param {MoneroNetworkType} networkType - network type of the address to validate
     * @return {boolean} true if the address is valid, false otherwise
     */
    static isValidAddress(address: string, networkType: MoneroNetworkType): boolean;
    /**
     * Validate the given address, throw an error if invalid.
     *
     * @param {string} address - address to validate
     * @param {MoneroNetworkType} networkType - network type of the address to validate
     */
    static validateAddress(address: string, networkType: MoneroNetworkType): void;
    /**
     * Determine if the given payment id is valid.
     *
     * @param {string} paymentId - payment id to determine if valid
     * @return {bool} true if the payment id is valid, false otherwise
     */
    static isValidPaymentId(paymentId: string): bool;
    /**
     * Validate the given payment id, throw an error if invalid.
     *
     * TODO: improve validation
     *
     * @param {string} paymentId - payment id to validate
     */
    static validatePaymentId(paymentId: string): void;
    /**
     * Decode tx extra according to https://cryptonote.org/cns/cns005.txt and
     * returns the last tx pub key.
     *
     * TODO: use c++ bridge for this
     *
     * @param [byte[]] txExtra - array of tx extra bytes
     * @return {string} the last pub key as a hexidecimal string
     */
    static getLastTxPubKey(txExtra: any): string;
    /**
     * Determines if two payment ids are functionally equal.
     *
     * For example, 03284e41c342f032 and 03284e41c342f032000000000000000000000000000000000000000000000000 are considered equal.
     *
     * @param {string} paymentId1 is a payment id to compare
     * @param {string} paymentId2 is a payment id to compare
     * @return {bool} true if the payment ids are equal, false otherwise
     */
    static paymentIdsEqual(paymentId1: string, paymentId2: string): bool;
    /**
     * Merges a transaction into a list of existing transactions.
     *
     * @param {MoneroTx[]} txs - existing transactions to merge into
     * @param {MoneroTx} tx - transaction to merge into the list
     */
    static mergeTx(txs: MoneroTx[], tx: MoneroTx): void;
    /**
     * Convert the given JSON to a binary Uint8Array using Monero's portable storage format.
     *
     * @param {object} json - json to convert to binary
     * @return {Uint8Array} the json converted to portable storage binary
     */
    static jsonToBinary(json: object): Uint8Array;
    /**
     * Convert the given portable storage binary to JSON.
     *
     * @param {Uint8Array} uint8arr - binary data in Monero's portable storage format
     * @return {object} JSON object converted from the binary data
     */
    static binaryToJson(uint8arr: Uint8Array): object;
    /**
     * Convert the binary response from daemon RPC block retrieval to JSON.
     *
     * @param {Uint8Array} uint8arr - binary response from daemon RPC when getting blocks
     * @return {object} JSON object with the blocks data
     */
    static binaryBlocksToJson(uint8arr: Uint8Array): object;
    /**
     * Convert XMR to atomic units.
     *
     * @param {number|string} amountXmr - amount in XMR to convert to atomic units
     * @return {BigInteger} amount in atomic units
     */
    static xmrToAtomicUnits(amountXmr: number | string): BigInteger;
    /**
     * Convert atomic units to XMR.
     *
     * @param {BigInteger|string} amountAtomicUnits - amount in atomic units to convert to XMR
     * @return {number} amount in XMR
     */
    static atomicUnitsToXmr(amountAtomicUnits: BigInteger | string): number;
    static _isHex64(str: any): boolean;
}
declare namespace MoneroUtils {
    const NUM_MNEMONIC_WORDS: number;
    const RING_SIZE: number;
    const MAX_REQUESTS_PER_SECOND: number;
    const AU_PER_XMR: number;
}
import MoneroNetworkType = require("../daemon/model/MoneroNetworkType");
import MoneroIntegratedAddress = require("../wallet/model/MoneroIntegratedAddress");
import BigInteger_1 = require("./biginteger");
import BigInteger = BigInteger_1.BigInteger;
