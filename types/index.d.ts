declare module 'monero-javascript' {
  import * as GenUtils from "./src/main/js/common/GenUtils";
  export import GenUtils = GenUtils;
  export var BigInteger: any;
  import * as Filter from "./src/main/js/common/Filter";
  export import Filter = Filter;
  import * as MoneroError from "./src/main/js/common/MoneroError";
  export import MoneroError = MoneroError;
  import * as HttpClient from "./src/main/js/common/HttpClient";
  export import HttpClient = HttpClient;
  import * as LibraryUtils from "./src/main/js/common/LibraryUtils";
  export import LibraryUtils = LibraryUtils;
  import * as MoneroRpcConnection from "./src/main/js/common/MoneroRpcConnection";
  export import MoneroRpcConnection = MoneroRpcConnection;
  import * as MoneroRpcError from "./src/main/js/common/MoneroRpcError";
  export import MoneroRpcError = MoneroRpcError;
  import * as SslOptions from "./src/main/js/common/SslOptions";
  export import SslOptions = SslOptions;
  import * as TaskLooper from "./src/main/js/common/TaskLooper";
  export import TaskLooper = TaskLooper;
  import * as ConnectionType from "./src/main/js/daemon/model/ConnectionType";
  export import ConnectionType = ConnectionType;
  import * as MoneroAltChain from "./src/main/js/daemon/model/MoneroAltChain";
  export import MoneroAltChain = MoneroAltChain;
  import * as MoneroBan from "./src/main/js/daemon/model/MoneroBan";
  export import MoneroBan = MoneroBan;
  import * as MoneroBlockHeader from "./src/main/js/daemon/model/MoneroBlockHeader";
  export import MoneroBlockHeader = MoneroBlockHeader;
  import * as MoneroBlock from "./src/main/js/daemon/model/MoneroBlock";
  export import MoneroBlock = MoneroBlock;
  import * as MoneroBlockTemplate from "./src/main/js/daemon/model/MoneroBlockTemplate";
  export import MoneroBlockTemplate = MoneroBlockTemplate;
  import * as MoneroConnectionSpan from "./src/main/js/daemon/model/MoneroConnectionSpan";
  export import MoneroConnectionSpan = MoneroConnectionSpan;
  import * as MoneroDaemonInfo from "./src/main/js/daemon/model/MoneroDaemonInfo";
  export import MoneroDaemonInfo = MoneroDaemonInfo;
  import * as MoneroDaemonListener from "./src/main/js/daemon/model/MoneroDaemonListener";
  export import MoneroDaemonListener = MoneroDaemonListener;
  import * as MoneroDaemonSyncInfo from "./src/main/js/daemon/model/MoneroDaemonSyncInfo";
  export import MoneroDaemonSyncInfo = MoneroDaemonSyncInfo;
  import * as MoneroDaemonUpdateCheckResult from "./src/main/js/daemon/model/MoneroDaemonUpdateCheckResult";
  export import MoneroDaemonUpdateCheckResult = MoneroDaemonUpdateCheckResult;
  import * as MoneroDaemonUpdateDownloadResult from "./src/main/js/daemon/model/MoneroDaemonUpdateDownloadResult";
  export import MoneroDaemonUpdateDownloadResult = MoneroDaemonUpdateDownloadResult;
  import * as MoneroHardForkInfo from "./src/main/js/daemon/model/MoneroHardForkInfo";
  export import MoneroHardForkInfo = MoneroHardForkInfo;
  import * as MoneroKeyImage from "./src/main/js/daemon/model/MoneroKeyImage";
  export import MoneroKeyImage = MoneroKeyImage;
  import * as MoneroKeyImageSpentStatus from "./src/main/js/daemon/model/MoneroKeyImageSpentStatus";
  export import MoneroKeyImageSpentStatus = MoneroKeyImageSpentStatus;
  import * as MoneroMinerTxSum from "./src/main/js/daemon/model/MoneroMinerTxSum";
  export import MoneroMinerTxSum = MoneroMinerTxSum;
  import * as MoneroMiningStatus from "./src/main/js/daemon/model/MoneroMiningStatus";
  export import MoneroMiningStatus = MoneroMiningStatus;
  import * as MoneroNetworkType from "./src/main/js/daemon/model/MoneroNetworkType";
  export import MoneroNetworkType = MoneroNetworkType;
  import * as MoneroOutput from "./src/main/js/daemon/model/MoneroOutput";
  export import MoneroOutput = MoneroOutput;
  import * as MoneroOutputHistogramEntry from "./src/main/js/daemon/model/MoneroOutputHistogramEntry";
  export import MoneroOutputHistogramEntry = MoneroOutputHistogramEntry;
  import * as MoneroSubmitTxResult from "./src/main/js/daemon/model/MoneroSubmitTxResult";
  export import MoneroSubmitTxResult = MoneroSubmitTxResult;
  import * as MoneroTx from "./src/main/js/daemon/model/MoneroTx";
  export import MoneroTx = MoneroTx;
  import * as MoneroTxPoolStats from "./src/main/js/daemon/model/MoneroTxPoolStats";
  export import MoneroTxPoolStats = MoneroTxPoolStats;
  import * as MoneroVersion from "./src/main/js/daemon/model/MoneroVersion";
  export import MoneroVersion = MoneroVersion;
  import * as MoneroPeer from "./src/main/js/daemon/model/MoneroPeer";
  export import MoneroPeer = MoneroPeer;
  import * as MoneroAccount from "./src/main/js/wallet/model/MoneroAccount";
  export import MoneroAccount = MoneroAccount;
  import * as MoneroAccountTag from "./src/main/js/wallet/model/MoneroAccountTag";
  export import MoneroAccountTag = MoneroAccountTag;
  import * as MoneroAddressBookEntry from "./src/main/js/wallet/model/MoneroAddressBookEntry";
  export import MoneroAddressBookEntry = MoneroAddressBookEntry;
  import * as MoneroCheck from "./src/main/js/wallet/model/MoneroCheck";
  export import MoneroCheck = MoneroCheck;
  import * as MoneroCheckReserve from "./src/main/js/wallet/model/MoneroCheckReserve";
  export import MoneroCheckReserve = MoneroCheckReserve;
  import * as MoneroCheckTx from "./src/main/js/wallet/model/MoneroCheckTx";
  export import MoneroCheckTx = MoneroCheckTx;
  import * as MoneroDestination from "./src/main/js/wallet/model/MoneroDestination";
  export import MoneroDestination = MoneroDestination;
  import * as MoneroIntegratedAddress from "./src/main/js/wallet/model/MoneroIntegratedAddress";
  export import MoneroIntegratedAddress = MoneroIntegratedAddress;
  import * as MoneroKeyImageImportResult from "./src/main/js/wallet/model/MoneroKeyImageImportResult";
  export import MoneroKeyImageImportResult = MoneroKeyImageImportResult;
  import * as MoneroMultisigInfo from "./src/main/js/wallet/model/MoneroMultisigInfo";
  export import MoneroMultisigInfo = MoneroMultisigInfo;
  import * as MoneroMultisigInitResult from "./src/main/js/wallet/model/MoneroMultisigInitResult";
  export import MoneroMultisigInitResult = MoneroMultisigInitResult;
  import * as MoneroMultisigSignResult from "./src/main/js/wallet/model/MoneroMultisigSignResult";
  export import MoneroMultisigSignResult = MoneroMultisigSignResult;
  import * as MoneroOutputWallet from "./src/main/js/wallet/model/MoneroOutputWallet";
  export import MoneroOutputWallet = MoneroOutputWallet;
  import * as MoneroOutputQuery from "./src/main/js/wallet/model/MoneroOutputQuery";
  export import MoneroOutputQuery = MoneroOutputQuery;
  import * as MoneroTxPriority from "./src/main/js/wallet/model/MoneroTxPriority";
  export import MoneroTxPriority = MoneroTxPriority;
  import * as MoneroTxConfig from "./src/main/js/wallet/model/MoneroTxConfig";
  export import MoneroTxConfig = MoneroTxConfig;
  import * as MoneroSubaddress from "./src/main/js/wallet/model/MoneroSubaddress";
  export import MoneroSubaddress = MoneroSubaddress;
  import * as MoneroSyncResult from "./src/main/js/wallet/model/MoneroSyncResult";
  export import MoneroSyncResult = MoneroSyncResult;
  import * as MoneroTransfer from "./src/main/js/wallet/model/MoneroTransfer";
  export import MoneroTransfer = MoneroTransfer;
  import * as MoneroIncomingTransfer from "./src/main/js/wallet/model/MoneroIncomingTransfer";
  export import MoneroIncomingTransfer = MoneroIncomingTransfer;
  import * as MoneroOutgoingTransfer from "./src/main/js/wallet/model/MoneroOutgoingTransfer";
  export import MoneroOutgoingTransfer = MoneroOutgoingTransfer;
  import * as MoneroTransferQuery from "./src/main/js/wallet/model/MoneroTransferQuery";
  export import MoneroTransferQuery = MoneroTransferQuery;
  import * as MoneroTxSet from "./src/main/js/wallet/model/MoneroTxSet";
  export import MoneroTxSet = MoneroTxSet;
  import * as MoneroTxWallet from "./src/main/js/wallet/model/MoneroTxWallet";
  export import MoneroTxWallet = MoneroTxWallet;
  import * as MoneroTxQuery from "./src/main/js/wallet/model/MoneroTxQuery";
  export import MoneroTxQuery = MoneroTxQuery;
  import * as MoneroWalletListener from "./src/main/js/wallet/model/MoneroWalletListener";
  export import MoneroWalletListener = MoneroWalletListener;
  import * as MoneroWalletConfig from "./src/main/js/wallet/model/MoneroWalletConfig";
  export import MoneroWalletConfig = MoneroWalletConfig;
  import * as MoneroMessageSignatureType from "./src/main/js/wallet/model/MoneroMessageSignatureType";
  export import MoneroMessageSignatureType = MoneroMessageSignatureType;
  import * as MoneroMessageSignatureResult from "./src/main/js/wallet/model/MoneroMessageSignatureResult";
  export import MoneroMessageSignatureResult = MoneroMessageSignatureResult;
  import * as MoneroConnectionManager from "./src/main/js/common/MoneroConnectionManager";
  export import MoneroConnectionManager = MoneroConnectionManager;
  import * as MoneroConnectionManagerListener from "./src/main/js/common/MoneroConnectionManagerListener";
  export import MoneroConnectionManagerListener = MoneroConnectionManagerListener;
  import * as MoneroUtils from "./src/main/js/common/MoneroUtils";
  export import MoneroUtils = MoneroUtils;
  import * as MoneroDaemon from "./src/main/js/daemon/MoneroDaemon";
  export import MoneroDaemon = MoneroDaemon;
  import * as MoneroDaemonRpc from "./src/main/js/daemon/MoneroDaemonRpc";
  export import MoneroDaemonRpc = MoneroDaemonRpc;
  import * as MoneroWallet from "./src/main/js/wallet/MoneroWallet";
  export import MoneroWallet = MoneroWallet;
  import * as MoneroWalletRpc from "./src/main/js/wallet/MoneroWalletRpc";
  export import MoneroWalletRpc = MoneroWalletRpc;
  import * as MoneroWalletKeys from "./src/main/js/wallet/MoneroWalletKeys";
  export import MoneroWalletKeys = MoneroWalletKeys;
  import * as MoneroWalletFull from "./src/main/js/wallet/MoneroWalletFull";
  export import MoneroWalletFull = MoneroWalletFull;
  export function getVersion(): string;
  export function connectToDaemonRpc(...args: any[]): typeof import("./src/main/js/daemon/MoneroDaemonRpc");
  export function connectToWalletRpc(...args: any[]): typeof import("./src/main/js/wallet/MoneroWalletRpc");
  export function createWalletFull(...args: any[]): typeof import("./src/main/js/wallet/MoneroWalletFull");
  export function openWalletFull(...args: any[]): typeof import("./src/main/js/wallet/MoneroWalletFull");
  export function createWalletKeys(...args: any[]): typeof import("./src/main/js/wallet/MoneroWalletKeys");
}
