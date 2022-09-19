import assert from "assert";
import GenUtils from "./GenUtils";
import HttpClient from "./HttpClient";
import LibraryUtils from "./LibraryUtils";
import MoneroBan from "../daemon/model/MoneroBan";
import MoneroBlock from "../daemon/model/MoneroBlock";
import MoneroDaemonListener from "../daemon/model/MoneroDaemonListener";
import MoneroDaemonRpc from "../daemon/MoneroDaemonRpc";
import MoneroError from "./MoneroError";
import MoneroKeyImage from "../daemon/model/MoneroKeyImage";
import MoneroRpcConnection from "./MoneroRpcConnection";
import MoneroTxConfig from "../wallet/model/MoneroTxConfig";
import MoneroTxSet from "../wallet/model/MoneroTxSet";
import MoneroUtils from "../common/MoneroUtils";
import MoneroWalletListener from "../wallet/model/MoneroWalletListener";
import MoneroWalletFull from "../wallet/MoneroWalletFull";

/**
 * Worker to manage a daemon and wasm wallet off the main thread using messages.
 * 
 * Required message format: e.data[0] = object id, e.data[1] = function name, e.data[2+] = function args
 *
 * For browser applications, this file must be browserified and placed in the web app root.
 * 
 * @private
 */
const onmessage = async function(e) {
  try{
    console.log("worker.onmessage");
    // initialize one time
    await self.initOneTime();
    
    // validate params
    let objectId = e.data[0];
    let fnName = e.data[1];
    let callbackId = e.data[2];
    assert(fnName, "Must provide function name to worker");
    assert(callbackId, "Must provide callback id to worker");
    if (!self[fnName]) throw new Error("Method '" + fnName + "' is not registered with worker");
    e.data.splice(1, 2); // remove function name and callback id to apply function with arguments
  } catch(e){
    console.log("Worker.onMessage failed: " + e);
  }
  // execute worker function and post result to callback
  try {
    postMessage([objectId, callbackId, {result: await self[fnName].apply(null, e.data)}]);
  } catch (e) {
    postMessage([objectId, callbackId, {error: e.message}]);
  }
}

self.initOneTime = async function() {
console.log("worker function running");

  if (!self.isInitialized) {
    self.WORKER_OBJECTS = {};
    self.isInitialized = true;
    MoneroUtils.PROXY_TO_WORKER = false;
  }
}

// --------------------------- STATIC UTILITIES -------------------------------

// TODO: object id not needed for static utilites, using throwaway uuid

self.httpRequest = async function(objectId, opts) {
console.log("worker function running");

  try {
    return await HttpClient.request(Object.assign(opts, {proxyToWorker: false}));  
  } catch (err) {
    throw err.statusCode ? new Error(JSON.stringify({statusCode: err.statusCode, statusMessage: err.message})) : err;
  }
}

self.setLogLevel = async function(objectId, level) {
console.log("worker function running");

  return LibraryUtils.setLogLevel(level);
}

self.getWasmMemoryUsed = async function(objectId) {
console.log("worker function running");

  return LibraryUtils.getWasmModule() && LibraryUtils.getWasmModule().HEAP8 ? LibraryUtils.getWasmModule().HEAP8.length : undefined;
}

// ----------------------------- MONERO UTILS ---------------------------------

self.moneroUtilsGetIntegratedAddress = async function(objectId, networkType, standardAddress, paymentId) {
console.log("worker function running");

  return (await MoneroUtils.getIntegratedAddress(networkType, standardAddress, paymentId)).toJson();
}

self.moneroUtilsValidateAddress = async function(objectId, address, networkType) {
console.log("worker function running");

  return MoneroUtils.validateAddress(address, networkType);
}

self.moneroUtilsJsonToBinary = async function(objectId, json) {
console.log("worker function running");

  return MoneroUtils.jsonToBinary(json);
}

self.moneroUtilsBinaryToJson = async function(objectId, uint8arr) {
console.log("worker function running");

  return MoneroUtils.binaryToJson(uint8arr);
}

self.moneroUtilsBinaryBlocksToJson = async function(objectId, uint8arr) {
console.log("worker function running");

  return MoneroUtils.binaryBlocksToJson(uint8arr);
}

// ---------------------------- DAEMON METHODS --------------------------------

self.daemonAddListener = async function(daemonId, listenerId) {
console.log("worker function running");

  let listener = new class extends MoneroDaemonListener {
    async onBlockHeader(blockHeader) {
      self.postMessage([daemonId, "onBlockHeader_" + listenerId, blockHeader.toJson()]);
    }
  }
  if (!self.daemonListeners) self.daemonListeners = {};
  self.daemonListeners[listenerId] = listener;
  await self.WORKER_OBJECTS[daemonId].addListener(listener);
}

self.daemonRemoveListener = async function(daemonId, listenerId) {
console.log("worker function running");

  if (!self.daemonListeners[listenerId]) throw new MoneroError("No daemon worker listener registered with id: " + listenerId);
  await self.WORKER_OBJECTS[daemonId].removeListener(self.daemonListeners[listenerId]);
  delete self.daemonListeners[listenerId];
}

self.connectDaemonRpc = async function(daemonId, config) {
console.log("worker function running");

  self.WORKER_OBJECTS[daemonId] = new MoneroDaemonRpc(config);
}

self.daemonGetRpcConnection = async function(daemonId) {
console.log("worker function running");

  let connection = await self.WORKER_OBJECTS[daemonId].getRpcConnection();
  return connection ? connection.getConfig() : undefined;
}

self.daemonIsConnected = async function(daemonId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].isConnected();
}

self.daemonGetVersion = async function(daemonId) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].getVersion()).toJson();
}

self.daemonIsTrusted = async function(daemonId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].isTrusted();
}

self.daemonGetHeight = async function(daemonId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].getHeight();
}

self.daemonGetBlockHash = async function(daemonId, height) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].getBlockHash(height);
}

self.daemonGetBlockTemplate = async function(daemonId, walletAddress, reserveSize) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].getBlockTemplate(walletAddress, reserveSize)).toJson();
}

self.daemonGetLastBlockHeader = async function(daemonId) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].getLastBlockHeader()).toJson();
}

self.daemonGetBlockHeaderByHash = async function(daemonId, hash) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].getBlockHeaderByHash(hash)).toJson();
}

self.daemonGetBlockHeaderByHeight = async function(daemonId, height) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].getBlockHeaderByHeight(height)).toJson();
}

self.daemonGetBlockHeadersByRange = async function(daemonId, startHeight, endHeight) {
console.log("worker function running");

  let blockHeadersJson = [];
  for (let blockHeader of await self.WORKER_OBJECTS[daemonId].getBlockHeadersByRange(startHeight, endHeight)) blockHeadersJson.push(blockHeader.toJson());
  return blockHeadersJson;
}

self.daemonGetBlockByHash = async function(daemonId, blockHash) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].getBlockByHash(blockHash)).toJson();
}

self.daemonGetBlocksByHash = async function(daemonId, blockHashes, startHeight, prune) {
console.log("worker function running");

  let blocksJson = [];
  for (let block of await self.WORKER_OBJECTS[daemonId].getBlocksByHash(blockHashes, startHeight, prune)) blocksJson.push(block.toJson());
  return blocksJson;
}

self.daemonGetBlockByHeight = async function(daemonId, height) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].getBlockByHeight(height)).toJson();
}

self.daemonGetBlocksByHeight = async function(daemonId, heights) {
console.log("worker function running");

  let blocksJson = [];
  for (let block of await self.WORKER_OBJECTS[daemonId].getBlocksByHeight(heights)) blocksJson.push(block.toJson());
  return blocksJson;
}

self.daemonGetBlocksByRange = async function(daemonId, startHeight, endHeight) {
console.log("worker function running");

  let blocksJson = [];
  for (let block of await self.WORKER_OBJECTS[daemonId].getBlocksByRange(startHeight, endHeight)) blocksJson.push(block.toJson());
  return blocksJson;
}

self.daemonGetBlocksByRangeChunked = async function(daemonId, startHeight, endHeight, maxChunkSize) {
console.log("worker function running");

  let blocksJson = [];
  for (let block of await self.WORKER_OBJECTS[daemonId].getBlocksByRangeChunked(startHeight, endHeight, maxChunkSize)) blocksJson.push(block.toJson());
  return blocksJson;
}

self.daemonGetBlockHashes = async function(daemonId, blockHashes, startHeight) {
console.log("worker function running");

  throw new Error("worker.getBlockHashes not implemented");
}

// TODO: factor common code with self.getTxs()
self.daemonGetTxs = async function(daemonId, txHashes, prune) {
console.log("worker function running");

  
  // get txs
  let txs = await self.WORKER_OBJECTS[daemonId].getTxs(txHashes, prune);
  
  // collect unique blocks to preserve model relationships as trees (based on monero_wasm_bridge.cpp::get_txs)
  let blocks = [];
  let unconfirmedBlock = undefined
  let seenBlocks = new Set();
  for (let tx of txs) {
    if (!tx.getBlock()) {
      if (!unconfirmedBlock) unconfirmedBlock = new MoneroBlock().setTxs([]);
      tx.setBlock(unconfirmedBlock);
      unconfirmedBlock.getTxs().push(tx);
    }
    if (!seenBlocks.has(tx.getBlock())) {
      seenBlocks.add(tx.getBlock());
      blocks.push(tx.getBlock());
    }
  }
  
  // serialize blocks to json
  for (let i = 0; i < blocks.length; i++) blocks[i] = blocks[i].toJson();
  return blocks;
}

self.daemonGetTxHexes = async function(daemonId, txHashes, prune) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].getTxHexes(txHashes, prune);
}

self.daemonGetMinerTxSum = async function(daemonId, height, numBlocks) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].getMinerTxSum(height, numBlocks)).toJson();
}

self.daemonGetFeeEstimate = async function(daemonId, graceBlocks) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].getFeeEstimate(graceBlocks)).toString();
}

self.daemonSubmitTxHex = async function(daemonId, txHex, doNotRelay) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].submitTxHex(txHex, doNotRelay)).toJson();
}

self.daemonRelayTxsByHash = async function(daemonId, txHashes) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].relayTxsByHash(txHashes);
}

self.daemonGetTxPool = async function(daemonId) {
console.log("worker function running");

  let txs = await self.WORKER_OBJECTS[daemonId].getTxPool();
  let block = new MoneroBlock().setTxs(txs);
  for (let tx of txs) tx.setBlock(block)
  return block.toJson();
}

self.daemonGetTxPoolHashes = async function(daemonId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].getTxPoolHashes();
}

//async getTxPoolBacklog() {
//  throw new MoneroError("Not implemented");
//}

self.daemonGetTxPoolStats = async function(daemonId) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].getTxPoolStats()).toJson();
}

self.daemonFlushTxPool = async function(daemonId, hashes) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].flushTxPool(hashes);
}

self.daemonGetKeyImageSpentStatuses = async function(daemonId, keyImages) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].getKeyImageSpentStatuses(keyImages);
}

//
//async getOutputs(outputs) {
//  throw new MoneroError("Not implemented");
//}

self.daemonGetOutputHistogram = async function(daemonId, amounts, minCount, maxCount, isUnlocked, recentCutoff) {
console.log("worker function running");

  let entriesJson = [];
  for (let entry of await self.WORKER_OBJECTS[daemonId].getOutputHistogram(amounts, minCount, maxCount, isUnlocked, recentCutoff)) {
    entriesJson.push(entry.toJson());
  }
  return entriesJson;
}

//
//async getOutputDistribution(amounts, cumulative, startHeight, endHeight) {
//  throw new MoneroError("Not implemented");
//}

self.daemonGetInfo = async function(daemonId) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].getInfo()).toJson();
}

self.daemonGetSyncInfo = async function(daemonId) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].getSyncInfo()).toJson();
}

self.daemonGetHardForkInfo = async function(daemonId) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].getHardForkInfo()).toJson();
}

self.daemonGetAltChains = async function(daemonId) {
console.log("worker function running");

  let altChainsJson = [];
  for (let altChain of await self.WORKER_OBJECTS[daemonId].getAltChains()) altChainsJson.push(altChain.toJson());
  return altChainsJson;
}

self.daemonGetAltBlockHashes = async function(daemonId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].getAltBlockHashes();
}

self.daemonGetDownloadLimit = async function(daemonId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].getDownloadLimit();
}

self.daemonSetDownloadLimit = async function(daemonId, limit) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].setDownloadLimit(limit);
}

self.daemonResetDownloadLimit = async function(daemonId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].resetDownloadLimit();
}

self.daemonGetUploadLimit = async function(daemonId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].getUploadLimit();
}

self.daemonSetUploadLimit = async function(daemonId, limit) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].setUploadLimit(limit);
}

self.daemonResetUploadLimit = async function(daemonId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].resetUploadLimit();
}

self.daemonGetPeers = async function(daemonId) {
console.log("worker function running");

  let peersJson = [];
  for (let peer of await self.WORKER_OBJECTS[daemonId].getPeers()) peersJson.push(peer.toJson());
  return peersJson;
}

self.daemonGetKnownPeers = async function(daemonId) {
console.log("worker function running");

  let peersJson = [];
  for (let peer of await self.WORKER_OBJECTS[daemonId].getKnownPeers()) peersJson.push(peer.toJson());
  return peersJson;
}

self.daemonSetOutgoingPeerLimit = async function(daemonId, limit) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].setOutgoingPeerLimit(limit);
}

self.daemonSetIncomingPeerLimit = async function(daemonId, limit) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].setIncomingPeerLimit(limit);
}

self.daemonGetPeerBans = async function(daemonId) {
console.log("worker function running");

  let bansJson = [];
  for (let ban of await self.WORKER_OBJECTS[daemonId].getPeerBans()) bansJson.push(ban.toJson());
  return bansJson;
}

self.daemonSetPeerBans = async function(daemonId, bansJson) {
console.log("worker function running");

  let bans = [];
  for (let banJson of bansJson) bans.push(new MoneroBan(banJson));
  return self.WORKER_OBJECTS[daemonId].setPeerBans(bans);
}

self.daemonStartMining = async function(daemonId, address, numThreads, isBackground, ignoreBattery) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].startMining(address, numThreads, isBackground, ignoreBattery);
}

self.daemonStopMining = async function(daemonId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].stopMining();
}

self.daemonGetMiningStatus = async function(daemonId) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].getMiningStatus()).toJson();
}

//
//async submitBlocks(blockBlobs) {
//  throw new MoneroError("Not implemented");
//}
//
//async checkForUpdate() {
//  throw new MoneroError("Not implemented");
//}
//
//async downloadUpdate(path) {
//  throw new MoneroError("Not implemented");
//}

self.daemonStop = async function(daemonId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[daemonId].stop();
}

self.daemonWaitForNextBlockHeader = async function(daemonId) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[daemonId].waitForNextBlockHeader()).toJson();
}

//------------------------------ WALLET METHODS -------------------------------

self.openWalletData = async function(walletId, path, password, networkType, keysData, cacheData, daemonUriOrConfig) {
console.log("worker function running");

  let daemonConnection = daemonUriOrConfig ? new MoneroRpcConnection(daemonUriOrConfig) : undefined;
  self.WORKER_OBJECTS[walletId] = await MoneroWalletFull.openWallet({path: "", password: password, networkType: networkType, keysData: keysData, cacheData: cacheData, server: daemonConnection, proxyToWorker: false});
  self.WORKER_OBJECTS[walletId]._setBrowserMainPath(path);
}

self._createWallet = async function(walletId, configJson) {
  let config = new MoneroWalletConfig(configJson);
  let path = config.getPath();
  config.setPath("");
  config.setProxyToWorker(false);
  self.WORKER_OBJECTS[walletId] = await MoneroWalletFull.createWallet(config);
  self.WORKER_OBJECTS[walletId]._setBrowserMainPath(path);
}

self.isViewOnly = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].isViewOnly();
}

self.getNetworkType = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getNetworkType();
}

//
//async getVersion() {
//  throw new Error("Not implemented");
//}

self.getMnemonic = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getMnemonic();
}

self.getMnemonicLanguage = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getMnemonicLanguage();
}

self.getMnemonicLanguages = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getMnemonicLanguages();
}

self.getPrivateSpendKey = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getPrivateSpendKey();
}

self.getPrivateViewKey = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getPrivateViewKey();
}

self.getPublicViewKey = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getPublicViewKey();
}

self.getPublicSpendKey = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getPublicSpendKey();
}

self.getAddress = async function(walletId, accountIdx, subaddressIdx) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getAddress(accountIdx, subaddressIdx);
}

self.getAddressIndex = async function(walletId, address) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].getAddressIndex(address)).toJson();
}

self.getIntegratedAddress = async function(walletId, standardAddress, paymentId) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].getIntegratedAddress(standardAddress, paymentId)).toJson();
}

self.decodeIntegratedAddress = async function(walletId, integratedAddress) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].decodeIntegratedAddress(integratedAddress)).toJson();
}

self.setDaemonConnection = async function(walletId, config) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].setDaemonConnection(config ? new MoneroRpcConnection(config) : undefined);
}

self.getDaemonConnection = async function(walletId) {
console.log("worker function running");

  let connection = await self.WORKER_OBJECTS[walletId].getDaemonConnection();
  return connection ? connection.getConfig() : undefined;
}

self.isConnectedToDaemon = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].isConnectedToDaemon();
}

self.getSyncHeight = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getSyncHeight();
}

self.setSyncHeight = async function(walletId, syncHeight) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].setSyncHeight(syncHeight);
}

self.getDaemonHeight = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getDaemonHeight();
}

self.getDaemonMaxPeerHeight = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getDaemonMaxPeerHeight()
}

self.getHeightByDate = async function(walletId, year, month, day) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getHeightByDate(year, month, day);
}

self.isDaemonSynced = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].isDaemonSynced();
}

self.getHeight = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getHeight();
}

self.addListener = async function(walletId, listenerId) {
console.log("worker function running");

  
  /**
   * Internal listener to bridge notifications to external listeners.
   * 
   * TODO: MoneroWalletListener is not defined until scripts imported
   * 
   * @private
   */
  class WalletWorkerHelperListener extends MoneroWalletListener {
    
    constructor(walletId, id, worker) {
      super();
      this.walletId = walletId;
      this.id = id;
      this.worker = worker;
    }
    
    getId() {
      return this.id;
    }
    
    onSyncProgress(height, startHeight, endHeight, percentDone, message) {
      this.worker.postMessage([this.walletId, "onSyncProgress_" + this.getId(), height, startHeight, endHeight, percentDone, message]);
    }

    onNewBlock(height) { 
      this.worker.postMessage([this.walletId, "onNewBlock_" + this.getId(), height]);
    }
    
    onBalancesChanged(newBalance, newUnlockedBalance) {
      this.worker.postMessage([this.walletId, "onBalancesChanged_" + this.getId(), newBalance.toString(), newUnlockedBalance.toString()]);
    }

    onOutputReceived(output) {
      let block = output.getTx().getBlock();
      if (block === undefined) block = new MoneroBlock().setTxs([output.getTx()]);
      this.worker.postMessage([this.walletId, "onOutputReceived_" + this.getId(), block.toJson()]);  // serialize from root block
    }
    
    onOutputSpent(output) {
      let block = output.getTx().getBlock();
      if (block === undefined) block = new MoneroBlock().setTxs([output.getTx()]);
      this.worker.postMessage([this.walletId, "onOutputSpent_" + this.getId(), block.toJson()]);     // serialize from root block
    }
  }
  
  let listener = new WalletWorkerHelperListener(walletId, listenerId, self);
  if (!self.listeners) self.listeners = [];
  self.listeners.push(listener);
  await self.WORKER_OBJECTS[walletId].addListener(listener);
}

self.removeListener = async function(walletId, listenerId) {
console.log("worker function running");

  for (let i = 0; i < self.listeners.length; i++) {
    if (self.listeners[i].getId() !== listenerId) continue;
    await self.WORKER_OBJECTS[walletId].removeListener(self.listeners[i]);
    self.listeners.splice(i, 1);
    return;
  }
  throw new MoneroError("Listener is not registered with wallet");
}

self.isSynced = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].isSynced();
}

self.sync = async function(walletId, startHeight, allowConcurrentCalls) {
console.log("worker function running");

  return await self.WORKER_OBJECTS[walletId].sync(undefined, startHeight, allowConcurrentCalls);
}

self.startSyncing = async function(walletId, syncPeriodInMs) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].startSyncing(syncPeriodInMs);
}

self.stopSyncing = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].stopSyncing();
}

self.scanTxs = async function(walletId, txHashes) {
  return self.WORKER_OBJECTS[walletId].scanTxs(txHashes);
}

self.rescanSpent = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].rescanSpent();
}

self.rescanBlockchain = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].rescanBlockchain();
}

self.getBalance = async function(walletId, accountIdx, subaddressIdx) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].getBalance(accountIdx, subaddressIdx)).toString();
}

self.getUnlockedBalance = async function(walletId, accountIdx, subaddressIdx) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].getUnlockedBalance(accountIdx, subaddressIdx)).toString();
}

self.getAccounts = async function(walletId, includeSubaddresses, tag) {
console.log("worker function running");

  let accountJsons = [];
  for (let account of await self.WORKER_OBJECTS[walletId].getAccounts(includeSubaddresses, tag)) accountJsons.push(account.toJson());
  return accountJsons;
}

self.getAccount = async function(walletId, accountIdx, includeSubaddresses) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].getAccount(accountIdx, includeSubaddresses)).toJson();
}

self.createAccount = async function(walletId, label) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].createAccount(label)).toJson();
}

self.getSubaddresses = async function(walletId, accountIdx, subaddressIndices) {
console.log("worker function running");

  let subaddressJsons = [];
  for (let subaddress of await self.WORKER_OBJECTS[walletId].getSubaddresses(accountIdx, subaddressIndices)) subaddressJsons.push(subaddress.toJson());
  return subaddressJsons;
}

self.createSubaddress = async function(walletId, accountIdx, label) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].createSubaddress(accountIdx, label)).toJson();
}

// TODO: easier or more efficient way than serializing from root blocks?
self.getTxs = async function(walletId, blockJsonQuery, missingTxHashes) {
console.log("worker function running");

  
  // deserialize query which is json string rooted at block
  let query = new MoneroBlock(blockJsonQuery, MoneroBlock.DeserializationType.TX_QUERY).getTxs()[0];
  
  // get txs
  let txs = await self.WORKER_OBJECTS[walletId].getTxs(query, missingTxHashes);
  
  // collect unique blocks to preserve model relationships as trees (based on monero_wasm_bridge.cpp::get_txs)
  let seenBlocks = new Set();
  let unconfirmedBlock = undefined;
  let blocks = [];
  for (let tx of txs) {
    if (!tx.getBlock()) {
      if (!unconfirmedBlock) unconfirmedBlock = new MoneroBlock().setTxs([]);
      tx.setBlock(unconfirmedBlock);
      unconfirmedBlock.getTxs().push(tx);
    }
    if (!seenBlocks.has(tx.getBlock())) {
      seenBlocks.add(tx.getBlock());
      blocks.push(tx.getBlock());
    }
  }
  
  // serialize blocks to json
  for (let i = 0; i < blocks.length; i++) blocks[i] = blocks[i].toJson();
  return {blocks: blocks, missingTxHashes: missingTxHashes};
}

self.getTransfers = async function(walletId, blockJsonQuery) {
console.log("worker function running");

  
  // deserialize query which is json string rooted at block
  let query = new MoneroBlock(blockJsonQuery, MoneroBlock.DeserializationType.TX_QUERY).getTxs()[0].getTransferQuery();
  
  // get transfers
  let transfers = await self.WORKER_OBJECTS[walletId].getTransfers(query);
  
  // collect unique blocks to preserve model relationships as tree
  let unconfirmedBlock = undefined;
  let blocks = [];
  let seenBlocks = new Set();
  for (let transfer of transfers) {
    let tx = transfer.getTx();
    if (!tx.getBlock()) {
      if (!unconfirmedBlock) unconfirmedBlock = new MoneroBlock().setTxs([]);
      tx.setBlock(unconfirmedBlock);
      unconfirmedBlock.getTxs().push(tx);
    }
    if (!seenBlocks.has(tx.getBlock())) {
      seenBlocks.add(tx.getBlock());
      blocks.push(tx.getBlock());
    }
  }
  
  // serialize blocks to json
  for (let i = 0; i < blocks.length; i++) blocks[i] = blocks[i].toJson();
  return blocks;
}

self.getOutputs = async function(walletId, blockJsonQuery) {
console.log("worker function running");


  // deserialize query which is json string rooted at block
  let query = new MoneroBlock(blockJsonQuery, MoneroBlock.DeserializationType.TX_QUERY).getTxs()[0].getOutputQuery();
  
  // get outputs
  let outputs = await self.WORKER_OBJECTS[walletId].getOutputs(query);
  
  // collect unique blocks to preserve model relationships as tree
  let unconfirmedBlock = undefined;
  let blocks = [];
  let seenBlocks = new Set();
  for (let output of outputs) {
    let tx = output.getTx();
    if (!tx.getBlock()) {
      if (!unconfirmedBlock) unconfirmedBlock = new MoneroBlock().setTxs([]);
      tx.setBlock(unconfirmedBlock);
      unconfirmedBlock.getTxs().push(tx);
    }
    if (!seenBlocks.has(tx.getBlock())) {
      seenBlocks.add(tx.getBlock());
      blocks.push(tx.getBlock());
    }
  }
  
  // serialize blocks to json
  for (let i = 0; i < blocks.length; i++) blocks[i] = blocks[i].toJson();
  return blocks;
}

self.exportOutputs = async function(walletId, all) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].exportOutputs(all);
}

self.importOutputs = async function(walletId, outputsHex) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].importOutputs(outputsHex);
}

self.getKeyImages = async function(walletId, all) {
console.log("worker function running");

  let keyImagesJson = [];
  for (let keyImage of await self.WORKER_OBJECTS[walletId].exportKeyImages(all)) keyImagesJson.push(keyImage.toJson());
  return keyImagesJson;
}

self.importKeyImages = async function(walletId, keyImagesJson) {
console.log("worker function running");

  let keyImages = [];
  for (let keyImageJson of keyImagesJson) keyImages.push(new MoneroKeyImage(keyImageJson));
  return (await self.WORKER_OBJECTS[walletId].importKeyImages(keyImages)).toJson();
}

//async getNewKeyImagesFromLastImport() {
//  throw new MoneroError("Not implemented");
//}

self.freezeOutput = async function(walletId, keyImage) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].freezeOutput(keyImage);
}

self.thawOutput = async function(walletId, keyImage) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].thawOutput(keyImage);
}

self.isOutputFrozen = async function(walletId, keyImage) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].isOutputFrozen(keyImage);
}

self.createTxs = async function(walletId, config) {
console.log("worker function running");

  if (typeof config === "object") config = new MoneroTxConfig(config);
  let txs = await self.WORKER_OBJECTS[walletId].createTxs(config);
  return txs[0].getTxSet().toJson();
}

self.sweepOutput = async function(walletId, config) {
console.log("worker function running");

  if (typeof config === "object") config = new MoneroTxConfig(config);
  let tx = await self.WORKER_OBJECTS[walletId].sweepOutput(config);
  return tx.getTxSet().toJson();
}

self.sweepUnlocked = async function(walletId, config) {
console.log("worker function running");

  if (typeof config === "object") config = new MoneroTxConfig(config);
  let txs = await self.WORKER_OBJECTS[walletId].sweepUnlocked(config);
  let txSets = [];
  for (let tx of txs) if (!GenUtils.arrayContains(txSets, tx.getTxSet())) txSets.push(tx.getTxSet());
  let txSetsJson = [];
  for (let txSet of txSets) txSetsJson.push(txSet.toJson());
  return txSetsJson;
}

self.sweepDust = async function(walletId, relay) {
console.log("worker function running");

  let txs = await self.WORKER_OBJECTS[walletId].sweepDust(relay);
  return txs.length === 0 ? {} : txs[0].getTxSet().toJson();
}

self.relayTxs = async function(walletId, txMetadatas) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].relayTxs(txMetadatas);
}

self.describeTxSet = async function(walletId, txSetJson) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].describeTxSet(new MoneroTxSet(txSetJson))).toJson();
}

self.signTxs = async function(walletId, unsignedTxHex) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].signTxs(unsignedTxHex);
}

self.submitTxs = async function(walletId, signedTxHex) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].submitTxs(signedTxHex);
}

self.signMessage = async function(walletId, message, signatureType, accountIdx, subaddressIdx) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].signMessage(message, signatureType, accountIdx, subaddressIdx);
}

self.verifyMessage = async function(walletId, message, address, signature) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].verifyMessage(message, address, signature)).toJson();
}

self.getTxKey = async function(walletId, txHash) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getTxKey(txHash);
}

self.checkTxKey = async function(walletId, txHash, txKey, address) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].checkTxKey(txHash, txKey, address)).toJson();
}

self.getTxProof = async function(walletId, txHash, address, message) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getTxProof(txHash, address, message);
}

self.checkTxProof = async function(walletId, txHash, address, message, signature) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].checkTxProof(txHash, address, message, signature)).toJson();
}

self.getSpendProof = async function(walletId, txHash, message) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getSpendProof(txHash, message);
}

self.checkSpendProof = async function(walletId, txHash, message, signature) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].checkSpendProof(txHash, message, signature);
}

self.getReserveProofWallet = async function(walletId, message) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getReserveProofWallet(message);
}

self.getReserveProofAccount = async function(walletId, accountIdx, amountStr, message) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getReserveProofAccount(accountIdx, amountStr, message);
}

self.checkReserveProof = async function(walletId, address, message, signature) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].checkReserveProof(address, message, signature)).toJson();
}

self.getTxNotes = async function(walletId, txHashes) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getTxNotes(txHashes);
}

self.setTxNotes = async function(walletId, txHashes, txNotes) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].setTxNotes(txHashes, txNotes);
}

self.getAddressBookEntries = async function(walletId, entryIndices) {
console.log("worker function running");

  let entriesJson = [];
  for (let entry of await self.WORKER_OBJECTS[walletId].getAddressBookEntries(entryIndices)) entriesJson.push(entry.toJson());
  return entriesJson;
}

self.addAddressBookEntry = async function(walletId, address, description) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].addAddressBookEntry(address, description);
}

self.editAddressBookEntry = async function(walletId, index, setAddress, address, setDescription, description) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].editAddressBookEntry(index, setAddress, address, setDescription, description);
}

self.deleteAddressBookEntry = async function(walletId, index) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].deleteAddressBookEntry(index);
}

self.tagAccounts = async function(walletId, tag, accountIndices) {
console.log("worker function running");

  throw new Error("Not implemented");
}

self.untagAccounts = async function(walletId, accountIndices) {
console.log("worker function running");

  throw new Error("Not implemented");
}

self.getAccountTags = async function(walletId) {
console.log("worker function running");

  throw new Error("Not implemented");
}

self.setAccountTagLabel = async function(walletId, tag, label) {
console.log("worker function running");

  throw new Error("Not implemented");
}

self.getPaymentUri = async function(walletId, configJson) {
  return self.WORKER_OBJECTS[walletId].getPaymentUri(new MoneroTxConfig(configJson));
}

self.parsePaymentUri = async function(walletId, uri) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].parsePaymentUri(uri)).toJson();
}

self.getAttribute = async function(walletId, key) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getAttribute(key);
}

self.setAttribute = async function(walletId, key, value) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].setAttribute(key, value);
}

self.startMining = async function(walletId, numThreads, backgroundMining, ignoreBattery) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].startMining(numThreads, backgroundMining, ignoreBattery);
}

self.stopMining = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].stopMining();
}

self.isMultisigImportNeeded = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].isMultisigImportNeeded();
}

self.isMultisig = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].isMultisig();
}

self.getMultisigInfo = async function(walletId) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].getMultisigInfo()).toJson();
}

self.prepareMultisig = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].prepareMultisig();
}

self.makeMultisig = async function(walletId, multisigHexes, threshold, password) {
  return await self.WORKER_OBJECTS[walletId].makeMultisig(multisigHexes, threshold, password);
}

self.exchangeMultisigKeys = async function(walletId, multisigHexes, password) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].exchangeMultisigKeys(multisigHexes, password)).toJson();
}

self.exportMultisigHex = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].exportMultisigHex();
}

self.importMultisigHex = async function(walletId, multisigHexes) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].importMultisigHex(multisigHexes);
}

self.signMultisigTxHex = async function(walletId, multisigTxHex) {
console.log("worker function running");

  return (await self.WORKER_OBJECTS[walletId].signMultisigTxHex(multisigTxHex)).toJson();
}

self.submitMultisigTxHex = async function(walletId, signedMultisigTxHex) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].submitMultisigTxHex(signedMultisigTxHex);
}

self.getData = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].getData();
}

self.changePassword = async function(walletId, oldPassword, newPassword) {
console.log(`\x1b[33m%s\x1b[0m: `, "worker function running");

  return self.WORKER_OBJECTS[walletId].changePassword(oldPassword, newPassword);
}

self.isClosed = async function(walletId) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].isClosed();
}

self.close = async function(walletId, save) {
console.log("worker function running");

  return self.WORKER_OBJECTS[walletId].close(save); // TODO: remove listeners and delete wallet from WORKER_OBJECTS
}
