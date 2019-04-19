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

module.exports = BufferWriter
