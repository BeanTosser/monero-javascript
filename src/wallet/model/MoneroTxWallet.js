const MoneroUtils = require("../../utils/MoneroUtils");
const MoneroTx = require("../../daemon/model/MoneroTx");

/**
 * Models a Monero transaction with additional fields in the context of a wallet.
 */
class MoneroTxWallet extends MoneroTx {
  
  constructor(json) {
    super(json);
  }
  
  getIsIncoming() {
    return this.json.isIncoming;
  }
  
  setIsIncoming(isIncoming) {
    this.json.isIncoming = isIncoming;
  }
  
  getIsOutgoing() {
    if (this.json.isIncoming === undefined) return undefined;
    return !this.json.isIncoming;
  }
  
  setIsOutgoing(isOutgoing) {
    this.setIsIncoming(isOutgoing === undefined ? undefined : !isOutgoing);
  }
  
  getTotalAmount() {
    return this.json.totalAmount;
  }
  
  setTotalAmount(totalAmount) {
    this.json.totalAmount = totalAmount;
  }
  
  getPayments() {
    return this.json.payments;
  }
  
  setPayments(payments) {
    this.json.payments = payments;
  }
  
  getSrcAccountIndex() {
    return this.json.srcAccountIndex;
  }
  
  setSrcAccountIndex(srcAccountIndex) {
    this.json.srcAccountIndex = srcAccountIndex;
  }
  
  getSrcSubaddressIndex() {
    return this.json.srcSubaddrIndex;
  }
  
  setSrcSubaddressIndex(srcSubaddrIndex) {
    this.json.srcSubaddrIndex = srcSubaddrIndex;
  }
  
  getSrcAddress() {
    return this.json.srcAddress;
  }
  
  setSrcAddress(srcAddress) {
    this.json.srcAddress = srcAddress;
  }
  
  getNote() {
    return this.json.note;
  }
  
  setNote(note) {
    this.json.note = note;
  }
  
  getMetadata() {
    return this.json.metadata;
  }
  
  setMetadata(metadata) {
    this.json.metadata = metadata;
  }
  
  copy() {
    return new MoneroTxWallet(Object.assign({}, this.json));  // create tx with copied json
  }
  
  toJson() {
    return this.json; // TODO: correctly serialize complex types
    //throw new Error("Not implemented");
  }
  
  toString(offset = 0) {
    let str = super.toString(offset) + '\n'
    str += MoneroUtils.kvLine("Is incoming", this.getIsIncoming(), offset);
    str += MoneroUtils.kvLine("Is outgoing", this.getIsOutgoing(), offset);
    str += MoneroUtils.kvLine("Total amount", this.getTotalAmount().toString(), offset);
    str += MoneroUtils.kvLine("Source account index", this.getSrcAccountIndex(), offset);
    str += MoneroUtils.kvLine("Source subaddress index", this.getSrcSubaddressIndex(), offset);
    str += MoneroUtils.kvLine("Source address", this.getSrcAddress(), offset);
    str += MoneroUtils.kvLine("Note: ", this.getNote(), offset);
    str += MoneroUtils.kvLine("Metadata: ", this.getMetadata(), offset);
    if (this.getPayments()) {
      str += MoneroUtils.kvLine("Payments", "", offset);
      for (let i = 0; i < this.getPayments().length; i++) {
        str += MoneroUtils.kvLine(i + 1, "", offset + 1);
        str += this.getPayments()[i].toString(offset + 2);
        if (i < this.getPayments().length - 1) str += '\n'
      }
    } else {
      str += MoneroUtils.kvLine("Payments", null, offset);
    }
    return str;
  }
  
  merge(tx, mergePayments) {
    
    // merge base transaction
    super.merge(tx);
    
    // merge extensions which need no special handling
    MoneroUtils.safeSet(this, this.getIsIncoming, this.setIsIncoming, tx.getIsIncoming());
    MoneroUtils.safeSet(this, this.getNote, this.setNote, tx.getNote());
    MoneroUtils.safeSet(this, this.getSrcAccountIndex, this.setSrcAccountIndex, tx.getSrcAccountIndex());
    MoneroUtils.safeSet(this, this.getSrcSubaddressIndex, this.setSrcSubaddressIndex, tx.getSrcSubaddressIndex());
    MoneroUtils.safeSet(this, this.getSrcAddress, this.setSrcAddress, tx.getSrcAddress());
    MoneroUtils.safeSet(this, this.getIsCoinbase, this.setIsCoinbase, tx.getIsCoinbase());
    MoneroUtils.safeSet(this, this.getMetadata, this.setMetadata, tx.getMetadata());
    
    // merge total amount
    if (this.json.totalAmount === undefined) this.json.totalAmount = tx.getTotalAmount();
    else {
      if (mergePayments) assert(totalAmount.toJSValue() === 0);
      else this.json.totalAmount = this.json.totalAmount.add(tx.getTotalAmount());
    }
    
    // merge payments
    if (this.json.payments === undefined) this.setPayments(tx.getPayments());
    else if (tx.getPayments() !== undefined) {
      if (mergePayments) {
        assert(tx.getPayments().length >= 0, "Tx " + tx.getId() + " cannot be merged because payments are different sizes");
        for (let i = 0; i < this.json.payments.length; i++) {
          this.json.payments[i].merge(tx.getPayments()[i]);
        }
      } else {
        for (let payment of tx.getPayments()) {
          this.json.payments.push(payment);
        }
      }
    }
  }
}

module.exports = MoneroTxWallet;