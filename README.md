# townforge-wasm

Builds [townforge](https://git.townforge.net/townforge/townforge) as a wasm for the browser.

## Building WebAssembly binaries from source

This project uses WebAssembly to package and execute Townforge's source code for use in a browser.

Compiled WebAssembly binaries are committed to ./dist for convenience, but these files can be built independently from source code:

1. Install and activate emscripten.
	1. Clone emscripten repository: `git clone https://github.com/emscripten-core/emsdk.git`
	2. `cd emsdk`
	3. `git pull && ./emsdk install latest-upstream && ./emsdk activate latest-upstream && source ./emsdk_env.sh`
	4. `export EMSCRIPTEN=path/to/emsdk/upstream/emscripten` (change for your system)
2. Clone townforge-wasm's repository: `git clone https://github.com/woodser/townforge-wasm.git`
3. `cd townforge-wasm`
4. `./bin/update_submodules.sh`
5. Modify ./external/monero-cpp/external/townforge/src/crypto/wallet/CMakeLists.txt from `set(MONERO_WALLET_CRYPTO_LIBRARY "auto" ...` to `set(MONERO_WALLET_CRYPTO_LIBRARY "cn" ...`.
6. `./bin/build_all.sh` (install [townforge dependencies](https://git.townforge.net/townforge/townforge#dependencies) as needed for your system)

## Running tests

1. Clone the project repository: `git clone https://github.com/woodser/townforge-wasm.git`
2. `cd townforge-wasm`
3. Start RPC servers:
	1. Download and install [Monero CLI](https://web.getmonero.org/downloads/).
	2. Start monero-daemon-rpc, e.g.: `./monerod --stagenet` (or use a remote daemon).
	3. Start monero-wallet-rpc, e.g.: `./monero-wallet-rpc --daemon-address http://localhost:38081 --stagenet --rpc-bind-port 38084 --rpc-login rpc_user:abc123 --wallet-dir ./`
4. Configure the appropriate RPC endpoints, authentication, and other settings in [TestUtils.js](src/test/utils/TestUtils.js) (e.g. `WALLET_RPC_CONFIG` and `DAEMON_RPC_CONFIG`).

#### Running tests in Node.js

* Run all tests: `npm test`
* Run tests by their description, e.g.: `npm run test -- --grep "Can get transactions"`

#### Running tests in a browser

1. Start monero-wallet-rpc servers used by tests: `./bin/start_wallet_rpc_test_servers.sh`
2. In another terminal, build browser tests: `./bin/build_browser_tests.sh`
3. Access http://localhost:8080/tests.html in a browser to run all tests

## License

This project is licensed under MIT.