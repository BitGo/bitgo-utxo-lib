var bufferUtils = require('./bufferutils')
var typeforce = require('typeforce')
var types = require('./types')
var varuint = require('varuint-bitcoin')

/**
 * Provide methods to sequentially read transaction fields in a buffer.
 *
 * @param buffer
 * @constructor
 */
function BufferReader (buffer) {
  typeforce(types.Buffer, buffer)
  this.buffer = buffer
  this.offset = 0
}

BufferReader.ZCASH_NUM_JOINSPLITS_INPUTS = 2
BufferReader.ZCASH_NUM_JOINSPLITS_OUTPUTS = 2
BufferReader.ZCASH_NOTECIPHERTEXT_SIZE = 1 + 8 + 32 + 32 + 512 + 16

BufferReader.prototype.getOffset = function () {
  return this.offset
}

BufferReader.prototype.addToOffset = function (increment) {
  this.offset += increment
}

BufferReader.prototype.readSlice = function (size) {
  this.offset += size
  return this.buffer.slice(this.offset - size, this.offset)
}

BufferReader.prototype.readUInt8 = function () {
  var i = this.buffer.readUInt8(this.offset)
  this.offset += 1
  return i
}

BufferReader.prototype.readUInt32 = function () {
  var i = this.buffer.readUInt32LE(this.offset)
  this.offset += 4
  return i
}

BufferReader.prototype.readInt32 = function () {
  var i = this.buffer.readInt32LE(this.offset)
  this.offset += 4
  return i
}

BufferReader.prototype.readInt64 = function () {
  var i = bufferUtils.readInt64LE(this.buffer, this.offset)
  this.offset += 8
  return i
}

BufferReader.prototype.readUInt64 = function () {
  var i = bufferUtils.readUInt64LE(this.buffer, this.offset)
  this.offset += 8
  return i
}

BufferReader.prototype.readVarInt = function () {
  var vi = varuint.decode(this.buffer, this.offset)
  this.offset += varuint.decode.bytes
  return vi
}

BufferReader.prototype.readVarSlice = function () {
  return this.readSlice(this.readVarInt())
}

BufferReader.prototype.readVector = function () {
  var count = this.readVarInt()
  var vector = []
  for (var i = 0; i < count; i++) vector.push(this.readVarSlice())
  return vector
}

BufferReader.prototype.readCompressedG1 = function () {
    var yLsb = this.readUInt8() & 1
    var x = this.readSlice(32)
    return {
      x: x,
      yLsb: yLsb
    }
  }

BufferReader.prototype.readCompressedG2 = function () {
  var yLsb = this.readUInt8() & 1
  var x = this.readSlice(64)
  return {
    x: x,
    yLsb: yLsb
  }
}

BufferReader.prototype.readZKProof = function (isSaplingCompatible) {
  var zkproof
  if (isSaplingCompatible) {
    zkproof = {
      sA: this.readSlice(48),
      sB: this.readSlice(96),
      sC: this.readSlice(48)
    }
  } else {
    zkproof = {
      gA: this.readCompressedG1(),
      gAPrime: this.readCompressedG1(),
      gB: this.readCompressedG2(),
      gBPrime: this.readCompressedG1(),
      gC: this.readCompressedG1(),
      gCPrime: this.readCompressedG1(),
      gK: this.readCompressedG1(),
      gH: this.readCompressedG1()
    }
  }
  return zkproof
}

BufferReader.prototype.readJoinSplit = function (isSaplingCompatible = true) {
  var vpubOld = this.readUInt64()
  var vpubNew = this.readUInt64()
  var anchor = this.readSlice(32)
  var nullifiers = []
  for (var j = 0; j < BufferReader.ZCASH_NUM_JOINSPLITS_INPUTS; j++) {
    nullifiers.push(this.readSlice(32))
  }
  var commitments = []
  for (j = 0; j < BufferReader.ZCASH_NUM_JOINSPLITS_OUTPUTS; j++) {
    commitments.push(this.readSlice(32))
  }
  var ephemeralKey = this.readSlice(32)
  var randomSeed = this.readSlice(32)
  var macs = []
  for (j = 0; j < BufferReader.ZCASH_NUM_JOINSPLITS_INPUTS; j++) {
    macs.push(this.readSlice(32))
  }

  var zkproof = this.readZKProof(isSaplingCompatible)
  var ciphertexts = []
  for (j = 0; j < BufferReader.ZCASH_NUM_JOINSPLITS_OUTPUTS; j++) {
    ciphertexts.push(this.readSlice(BufferReader.ZCASH_NOTECIPHERTEXT_SIZE))
  }
  return {
    vpubOld: vpubOld,
    vpubNew: vpubNew,
    anchor: anchor,
    nullifiers: nullifiers,
    commitments: commitments,
    ephemeralKey: ephemeralKey,
    randomSeed: randomSeed,
    macs: macs,
    zkproof: zkproof,
    ciphertexts: ciphertexts
  }
}

BufferReader.prototype.readShieldedSpend = function (isSaplingCompatible) {
  var cv = this.readSlice(32)
  var anchor = this.readSlice(32)
  var nullifier = this.readSlice(32)
  var rk = this.readSlice(32)
  var zkproof = this.readZKProof(isSaplingCompatible)
  var spendAuthSig = this.readSlice(64)
  return {
    cv: cv,
    anchor: anchor,
    nullifier: nullifier,
    rk: rk,
    zkproof: zkproof,
    spendAuthSig: spendAuthSig
  }
}

BufferReader.prototype.readShieldedOutput = function (isSaplingCompatible) {
  var cv = this.readSlice(32)
  var cmu = this.readSlice(32)
  var ephemeralKey = this.readSlice(32)
  var encCiphertext = this.readSlice(580)
  var outCiphertext = this.readSlice(80)
  var zkproof = this.readZKProof(isSaplingCompatible)

  return {
    cv: cv,
    cmu: cmu,
    ephemeralKey: ephemeralKey,
    encCiphertext: encCiphertext,
    outCiphertext: outCiphertext,
    zkproof: zkproof
  }
}

module.exports = BufferReader
