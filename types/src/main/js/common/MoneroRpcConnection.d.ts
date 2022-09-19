export = MoneroRpcConnection;
/**
 * Maintains a connection and sends requests to a Monero RPC API.
 */
declare class MoneroRpcConnection {
    static _validateHttpResponse(resp: any): void;
    static _validateRpcResponse(resp: any, method: any, params: any): void;
    /**
     * <p>Construct a RPC connection.</p>
     *
     * <p>Examples:</p>
     *
     * <code>
     * let connection1 = new MoneroRpcConnection("http://localhost:38081", "daemon_user", "daemon_password_123")<br><br>
     *
     * let connection2 = new MoneroRpcConnection({<br>
     * &nbsp;&nbsp; uri: http://localhost:38081,<br>
     * &nbsp;&nbsp; username: "daemon_user",<br>
     * &nbsp;&nbsp; password: "daemon_password_123",<br>
     * &nbsp;&nbsp; rejectUnauthorized: false, // accept self-signed certificates e.g. for local development<br>
     * &nbsp;&nbsp; proxyToWorker: true // proxy request to worker (default false)<br>
     * });
     * </code>
     *
     * @param {string|object|MoneroRpcConnection} uriOrConfigOrConnection - RPC endpoint URI, MoneroRpcConnection, or equivalent JS object
     * @param {string} uriOrConfigOrConnection.uri - URI of the RPC endpoint
     * @param {string} [uriOrConfigOrConnection.username] - username to authenticate with the RPC endpoint (optional)
     * @param {string} [uriOrConfigOrConnection.password] - password to authenticate with the RPC endpoint (optional)
     * @param {boolean} [uriOrConfigOrConnection.rejectUnauthorized] - rejects self-signed certificates if true (default true)
     * @param {boolean} uriOrConfigOrConnection.proxyToWorker - proxy requests to worker
     * @param {string} [username] - username to authenticate with the RPC endpoint (optional)
     * @param {string} [password] - password to authenticate with the RPC endpoint (optional)
     * @param {boolean} [rejectUnauthorized] - reject self-signed certificates if true (default true)
     * @param {boolean} [proxyToWorker] - use web worker (default true)
     */
    constructor(uriOrConfigOrConnection: string | object | MoneroRpcConnection, username?: string, password?: string, rejectUnauthorized?: boolean, proxyToWorker: any);
    _config: any;
    setCredentials(username: any, password: any): MoneroRpcConnection;
    _isOnline: boolean;
    _isAuthenticated: boolean;
    getUri(): any;
    getUsername(): any;
    getPassword(): any;
    getRejectUnauthorized(): any;
    setProxyToWorker(proxyToWorker: any): MoneroRpcConnection;
    getProxyToWorker(): any;
    getConfig(): any;
    getPriority(): any;
    /**
     * Set the connection's priority relative to other connections. Priority 1 is highest,
     * then priority 2, etc. The default priority of 0 is lowest priority.
     *
     * @@param {number} [priority] - the connection priority (default 0)
     * @return {MoneroRpcConnection} this connection
     */
    setPriority(priority?: number): MoneroRpcConnection;
    setAttribute(key: any, value: any): MoneroRpcConnection;
    attributes: Map<any, any>;
    getAttribute(key: any): any;
    /**
     * Check the connection status to update isOnline, isAuthenticated, and response time.
     *
     * @@param {number} timeoutInMs - maximum response time before considered offline
     * @return {Promise<boolean>} true if there is a change in status, false otherwise
     */
    checkConnection(timeoutInMs: number): Promise<boolean>;
    _responseTime: number;
    /**
     * Indicates if the connection is connected according to the last call to checkConnection().<br><br>
     *
     * Note: must call checkConnection() manually unless using MoneroConnectionManager.
     *
     * @return {boolean|undefined} true or false to indicate if connected, or undefined if checkConnection() has not been called
     */
    isConnected(): boolean | undefined;
    /**
     * Indicates if the connection is online according to the last call to checkConnection().<br><br>
     *
     * Note: must call checkConnection() manually unless using MoneroConnectionManager.
     *
     * @return {boolean|undefined} true or false to indicate if online, or undefined if checkConnection() has not been called
     */
    isOnline(): boolean | undefined;
    /**
     * Indicates if the connection is authenticated according to the last call to checkConnection().<br><br>
     *
     * Note: must call checkConnection() manually unless using MoneroConnectionManager.
     *
     * @return {boolean|undefined} true if authenticated or no authentication, false if not authenticated, or undefined if checkConnection() has not been called
     */
    isAuthenticated(): boolean | undefined;
    getResponseTime(): number;
    /**
     * Send a JSON RPC request.
     *
     * @param {string} method - JSON RPC method to invoke
     * @param {object} params - request parameters
     * @@param {number} timeoutInMs - request timeout in milliseconds
     * @return {object} is the response map
     */
    sendJsonRequest(method: string, params: object, timeoutInMs: number): object;
    /**
     * Send a RPC request to the given path and with the given paramters.
     *
     * E.g. "/get_transactions" with params
     *
     * @param {string} path - JSON RPC path to invoke
     * @param {object} params - request parameters
     * @@param {number} timeoutInMs - request timeout in milliseconds
     * @return {object} is the response map
     */
    sendPathRequest(path: string, params: object, timeoutInMs: number): object;
    /**
     * Send a binary RPC request.
     *
     * @param {string} path - path of the binary RPC method to invoke
     * @param {object} params - request parameters
     * @@param {number} timeoutInMs - request timeout in milliseconds
     * @return {Uint8Array} the binary response
     */
    sendBinaryRequest(path: string, params: object, timeoutInMs: number): Uint8Array;
    toString(): string;
    _setFakeDisconnected(fakeDisconnected: any): void;
    _fakeDisconnected: any;
}
declare namespace MoneroRpcConnection {
    namespace DEFAULT_CONFIG {
        const uri: any;
        const username: any;
        const password: any;
        const rejectUnauthorized: boolean;
        const proxyToWorker: boolean;
        const priority: number;
    }
    const SUPPORTED_FIELDS: string[];
}
