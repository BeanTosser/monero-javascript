export = MoneroError;
/**
 * Exception when interacting with a Monero wallet or daemon.
 */
declare class MoneroError extends Error {
    /**
     * Constructs the error.
     *
     * @param {string} message is a human-readable message of the error
     * @@param {number} code is the error code (optional)
     */
    constructor(message: string, code: number);
    code: number;
    getCode(): number;
}
