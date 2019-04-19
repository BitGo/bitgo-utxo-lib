var Buffer = require('safe-buffer').Buffer
var bufferutils = require('./bufferutils')
var varuint = require('varuint-bitcoin')

/**
 *
 * @param bufferSize
 * @param initialOffset
 * @constructor
 */
function BufferWriter (bufferSize, initialOffset = 0) {
  this.buffer = Buffer.allocUnsafe(bufferSize)
  this.offset = initialOffset
  this.initialOffset = initialOffset
}

BufferWriter.ZCASH_G1_PREFIX_MASK = 0x02
BufferWriter.ZCASH_G2_PREFIX_MASK = 0x0a

BufferWriter.prototype.setBuffer = function (buffer) {
  this.buffer = buffer
}

BufferWriter.prototype.getBuffer = function () {
  return this.buffer.slice(this.initialOffset, this.offset)
}

BufferWriter.prototype.writeSlice = function (slice) {
  this.offset += slice.copy(this.buffer, this.offset)
}

BufferWriter.prototype.writeUInt8 = function (input) {
  this.offset = this.buffer.writeUInt8(input, this.offset)
}

BufferWriter.prototype.writeInt32 = function (input) {
  this.offset = this.buffer.writeInt32LE(input, this.offset)
}

BufferWriter.prototype.writeUInt32 = function (input) {
  this.offset = this.buffer.writeUInt32LE(input, this.offset)
}

BufferWriter.prototype.writeUInt64 = function (input) {
  this.offset = bufferutils.writeUInt64LE(this.buffer, input, this.offset)
}

BufferWriter.prototype.writeVarInt = function (input) {
  varuint.encode(input, this.buffer, this.offset)
  this.offset += varuint.encode.bytes
}

BufferWriter.prototype.writeVarSlice = function (slice) {
  this.writeVarInt(slice.length)
  this.writeSlice(slice)
}

BufferWriter.prototype.writeVector = function (vector) {
  this.writeVarInt(vector.length)
  for (var i = 0; i < vector.length; ++i) {
    this.writeVarSlice(vector[i])
  }
}

BufferWriter.prototype.writeCompressedG1 = function (i) {
  this.writeUInt8(BufferWriter.ZCASH_G1_PREFIX_MASK | i.yLsb)
  this.writeSlice(i.x)
}

BufferWriter.prototype.writeCompressedG2 = function (i) {
  this.writeUInt8(BufferWriter.ZCASH_G2_PREFIX_MASK | i.yLsb)
  this.writeSlice(i.x)
}

BufferWriter.prototype.writeShieldedSpend = function (shieldedSpend) {
  this.writeSlice(shieldedSpend.cv)
  this.writeSlice(shieldedSpend.anchor)
  this.writeSlice(shieldedSpend.nullifier)
  this.writeSlice(shieldedSpend.rk)
  this.writeSlice(shieldedSpend.zkproof.sA)
  this.writeSlice(shieldedSpend.zkproof.sB)
  this.writeSlice(shieldedSpend.zkproof.sC)
  this.writeSlice(shieldedSpend.spendAuthSig)
}

BufferWriter.prototype.writeShieldedOutput = function (shieldedOutput) {
  this.writeSlice(shieldedOutput.cv)
  this.writeSlice(shieldedOutput.cmu)
  this.writeSlice(shieldedOutput.ephemeralKey)
  this.writeSlice(shieldedOutput.encCiphertext)
  this.writeSlice(shieldedOutput.outCiphertext)
  this.writeSlice(shieldedOutput.zkproof.sA)
  this.writeSlice(shieldedOutput.zkproof.sB)
  this.writeSlice(shieldedOutput.zkproof.sC)
}

BufferWriter.prototype.writeJoinSplit = function (joinsplit, isSaplingCompatible = true) {
  this.writeUInt64(joinsplit.vpubOld)
  this.writeUInt64(joinsplit.vpubNew)
  this.writeSlice(joinsplit.anchor)
  joinsplit.nullifiers.forEach(function (nullifier) {
    this.writeSlice(nullifier)
  }, this)
  joinsplit.commitments.forEach(function (nullifier) {
    this.writeSlice(nullifier)
  }, this)
  this.writeSlice(joinsplit.ephemeralKey)
  this.writeSlice(joinsplit.randomSeed)
  joinsplit.macs.forEach(function (nullifier) {
    this.writeSlice(nullifier)
  }, this)
  if (isSaplingCompatible) {
    this.writeSlice(joinsplit.zkproof.sA)
    this.writeSlice(joinsplit.zkproof.sB)
    this.writeSlice(joinsplit.zkproof.sC)
  } else {
    this.writeCompressedG1(joinsplit.zkproof.gA)
    this.writeCompressedG1(joinsplit.zkproof.gAPrime)
    this.writeCompressedG2(joinsplit.zkproof.gB)
    this.writeCompressedG1(joinsplit.zkproof.gBPrime)
    this.writeCompressedG1(joinsplit.zkproof.gC)
    this.writeCompressedG1(joinsplit.zkproof.gCPrime)
    this.writeCompressedG1(joinsplit.zkproof.gK)
    this.writeCompressedG1(joinsplit.zkproof.gH)
  }
  joinsplit.ciphertexts.forEach(function (ciphertext) {
    this.writeSlice(ciphertext)
  }, this)
}

module.exports = BufferWriter
