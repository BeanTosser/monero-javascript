# Monero JavaScript Library

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Sample code](#sample-code)
- [Using monero-javascript in your project](#using-monero-javascript-in-your-project)
- [Developer guide](#developer-guide)
- [Compiling WebAssembly binaries from source](#compiling-webassembly-binaries-from-source)
- [Running tests](#running-tests)
- [See also](#see-also)
- [License](#license)
- [Donations](#donations)

## Overview

This project is a JavaScript library for using Monero in Node.js or the browser via RPC and native WebAssembly bindings to [Monero Core v0.16.0.0 'Nitrogen Nebula'](https://web.getmonero.org/downloads/).

- Supports RPC clients of monero-daemon-rpc and monero-wallet-rpc.
- Supports fully client-side wallets using native WebAssembly bindings to Monero Core.
- Conforms to an [API specification](https://moneroecosystem.org/monero-java/monero-spec.pdf) intended to be intuitive and robust.
- [Query wallet transactions, transfers, and outputs](docs/developer_guide/query_data_model.md) by their many attributes.
- Fetch and process binary data from the daemon (e.g. raw blocks).
- Receive notifications when blocks are added to the chain or when wallets sync, send, or receive.
- Over 250 passing Mocha test cases.

## Architecture

<p align="center">
	<img width="85%" height="auto" src="docs/img/architecture.png"/><br>
	<i>Wallet implementations use RPC or WebAssembly bindings to Monero Core and are interchangeable by conforming to a common interface, <a href="https://moneroecosystem.org/monero-javascript/MoneroWallet.html">MoneroWallet.js</a>.</i>
</p>

## Sample Code

This code introduces the API used in monero-javascript.  See the [JSDocs](https://moneroecosystem.org/monero-javascript/MoneroWallet.html) or [API specification](https://moneroecosystem.org/monero-java/monero-spec.pdf) for more detail.

```js
// import library
require("monero-javascript");

// connect to a daemon
let daemon = new MoneroDaemonRpc("http://localhost:38081", "superuser", "abctesting123"); 
let height = await daemon.getHeight();            // 1523651
let feeEstimate = await daemon.getFeeEstimate();  // 1014313512
let txsInPool = await daemon.getTxPool();         // get transactions in the pool

// open wallet on monero-wallet-rpc
let walletRpc = new MoneroWalletRpc("http://localhost:38083", "rpc_user", "abc123");
await walletRpc.openWallet("sample_wallet_rpc", "supersecretpassword123");
let primaryAddress = await walletRpc.getPrimaryAddress(); // 555zgduFhmKd2o8rPUz...
let balance = await walletRpc.getBalance();               // 533648366742
let txs = await walletRpc.getTxs();                       // get transactions containing transfers to/from the wallet

// create wallet from mnemonic phrase using WebAssembly bindings to Monero Core
let walletWasm = await MoneroWalletWasm.createWallet({
  path: "sample_wallet_wasm",
  password: "supersecretpassword123",
  networkType: "stagenet",
  serverUri: "http://localhost:38081",
  serverUsername: "superuser",
  serverPassword: "abctesting123",
  mnemonic: "hefty value scenic...",
  restoreHeight: 573936,
});

// synchronize with progress notifications
await walletWasm.sync(new class extends MoneroWalletListener {
  onSyncProgress(height, startHeight, endHeight, percentDone, message) {
    // feed a progress bar?
  }
});

// synchronize in the background
await walletWasm.startSyncing();

// listen for incoming transfers
let fundsReceived = false;
await walletWasm.addListener(new class extends MoneroWalletListener {
  onOutputReceived(output) {
    let amount = output.getAmount();
    let txHash = output.getTx().getHash();
    fundsReceived = true;
  }
});

// send funds from RPC wallet to WebAssembly wallet
let createdTx = await walletRpc.createTx({
  accountIndex: 0,
  address: await walletWasm.getAddress(1, 0),
  amount: new BigInteger("50000"), // amount to transfer in atomic units
  relay: false // create transaction and relay to the network if true
});
let fee = createdTx.getFee(); // "Are you sure you want to send... ?"
await walletRpc.relayTx(createdTx); // relay the transaction

// recipient receives unconfirmed funds within 10 seconds
await new Promise(function(resolve) { setTimeout(resolve, 10000); });
assert(fundsReceived);

// save and close WebAssembly wallet
await walletWasm.close(true);
```

## Using monero-javascript in your project

1. `cd your_project` or `mkdir your_project && cd your_project && npm init`
2. `npm install monero-javascript`
3. Add `require("monero-javascript")` to your application code.

If using RPC servers:
1. Download and install [Monero CLI](https://web.getmonero.org/downloads/).
2. Start monero-daemon-rpc, e.g.: `./monerod --stagenet` (or use a remote daemon).
3. Start monero-wallet-rpc, e.g.: `./monero-wallet-rpc --daemon-address http://localhost:38081 --stagenet --rpc-bind-port 38083 --rpc-login rpc_user:abc123 --wallet-dir ./`

## Developer Guide

(work in progress)

* [Installing prerequisites](docs/developer_guide/installing_prerequisite_software.md)
* [Getting started part 1: build a NodeJS application](docs/developer_guide/getting_started.md)
* [Getting started part 2: build a web application](docs/developer_guide/web_app_guide.md)
* [Creating wallets](docs/developer_guide/creating_wallets.md)
* [The data model: blocks, transactions, transfers, and outputs](docs/developer_guide/data_model.md)
* [Getting transactions, transfers, and outputs](docs/developer_guide/query_data_model.md)
* [Sending funds](docs/developer_guide/sending_funds.md)
* [Multisig wallets](docs/developer_guide/multisig_wallets.md)
* [View-only and offline wallets](docs/developer_guide/view_only_offline.md)

## Compiling WebAssembly binaries from source

This project uses WebAssembly to package and execute Monero Core's source code for use in a browser or other WebAssembly-supported environments.

Compiled WebAssembly binaries are committed to ./dist for convenience, but these files can be built independently from source code:

1. Install and activate emscripten
	1. Clone emscripten repository: `git clone https://github.com/emscripten-core/emsdk.git`
	2. `cd emsdk`
	3. `git pull && ./emsdk install latest-upstream && ./emsdk activate latest-upstream && source ./emsdk_env.sh`
	4. `export EMSCRIPTEN=/absolute/path/to/emsdk/upstream/emscripten` (change for your system)
2. Clone monero-javascript repository: `git clone https://github.com/monero-ecosystem/monero-javascript.git`
3. `cd monero-javascript`
4. `./bin/build_all.sh`

## Running tests

1. Clone monero-javascript repository: `git clone https://github.com/monero-ecosystem/monero-javascript.git`
2. `cd monero-javascript`
3. Start RPC servers:
	1. Download and install [Monero CLI](https://web.getmonero.org/downloads/).
	2. Start monero-daemon-rpc, e.g.: `./monerod --stagenet` (or use a remote daemon).
	3. Start monero-wallet-rpc, e.g.: `./monero-wallet-rpc --daemon-address http://localhost:38081 --stagenet --rpc-bind-port 38083 --rpc-login rpc_user:abc123 --wallet-dir ./`
4. Configure the appropriate RPC endpoints and authentication by modifying `WALLET_RPC_CONFIG` and `DAEMON_RPC_CONFIG` in [TestUtils.js](src/test/utils/TestUtils.js).

### Running tests in NodeJS

* Run all tests: `npm test`
* Run tests by their description: `node_modules/mocha/bin/mocha src/test/TestAll --grep "Can get transactions" --timeout 2000000`

### Running tests in the browser

1. `./bin/build_browser_tests.sh`
2. Open browser to http://localhost:9100/tests.html

## See Also

* [monero-java](https://github.com/monero-ecosystem/monero-java)
* [monero-cpp-library](https://github.com/woodser/monero-cpp-library)
* [xmr-sample-app](https://github.com/woodser/xmr-sample-app/) - sample web app template (under development)
* [monerostresstester.com](https://github.com/woodser/monerostresstester.com) - sends repeated txs to self to stress test the network (under development)
* [monerowebwallet.com](https://github.com/woodser/monerowebwallet.com) - open-source, client-side web wallet (under development)

## License

This project is licensed under MIT.

## Donations

If this library brings you value, please consider donating.

<p align="center">
	<img src="donate.png" width="115" height="115"/><br>
	<code>46FR1GKVqFNQnDiFkH7AuzbUBrGQwz2VdaXTDD4jcjRE8YkkoTYTmZ2Vohsz9gLSqkj5EM6ai9Q7sBoX4FPPYJdGKQQXPVz</code>
</p>
