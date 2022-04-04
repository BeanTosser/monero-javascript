export = MoneroNetworkType;
/**
 * Defines the Monero network types (mainnet, testnet, and stagenet).
 *
 * @hideconstructor
 */
declare class MoneroNetworkType {
    /**
     * Validates the given network type.
     *
     * @@param {number} networkType - the network type to validate as a numeric
     */
    static validate(networkType: number): void;
    /**
     * Indicates if the given network type is valid or not.
     *
     * @@param {number} networkType - the network type to validate as a numeric
     * @return {boolean} true if the network type is valid, false otherwise
     */
    static isValid(networkType: number): boolean;
    /**
     * Parse the given string as a network type.
     *
     * @param {string} networkTypeStr - "mainnet", "testnet", or "stagenet" (case insensitive)
     * @return {int} the network type as a numeric
     */
    static parse(networkTypeStr: string): int;
    /**
     * Get the network type in human-readable form.
     *
     * @return {string} the network type in human-readable form
     */
    static toString(networkType: any): string;
}
declare namespace MoneroNetworkType {
    const MAINNET: number;
    const TESTNET: number;
    const STAGENET: number;
}
