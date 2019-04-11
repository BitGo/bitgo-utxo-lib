// m [pubKeys ...] n OP_CHECKMULTISIG

var bscript = require('../../script')
var OPS = require('bitcoin-ops')
var OP_INT_BASE = OPS.OP_RESERVED // OP_1 - 1

function check (script, allowIncomplete: boolean) {
  var chunks = bscript.decompile(script)

  if (chunks.length < 4) return false
  if (chunks[chunks.length - 1] !== OPS.OP_CHECKMULTISIG) return false;
  if (typeof chunks[0] !== 'number') return false;
  if (typeof chunks[chunks.length - 2] !== 'number') return false;
  var m = chunks[0] - OP_INT_BASE
  var n = chunks[chunks.length - 2] - OP_INT_BASE

  if (m <= 0) return false
  if (n > 16) return false
  if (m > n) return false
  if (n !== chunks.length - 3) return false
  if (allowIncomplete) return true

  var keys = chunks.slice(1, -2)
  return keys.every(bscript.isCanonicalPubKey)
}
check.toJSON = function () { return 'multi-sig output' }

function encode (m: number, pubKeys: any) {
  // typeforce({
  //   m: types.Number,
  //   pubKeys: [bscript.isCanonicalPubKey]
  // }, {
  //   m: m,
  //   pubKeys: pubKeys
  // })

  var n = pubKeys.length
  if (n < m) throw new TypeError('Not enough pubKeys provided')

  return bscript.compile([].concat(
    OP_INT_BASE + m,
    pubKeys,
    OP_INT_BASE + n,
    OPS.OP_CHECKMULTISIG
  ))
}

function decode (buffer: Buffer, allowIncomplete?: boolean) {
  var chunks = bscript.decompile(buffer);
  if (!check(chunks, allowIncomplete)) {
    throw Error('Check failed')
  }

  return {
    m: chunks[0] - OP_INT_BASE,
    pubKeys: chunks.slice(1, -2)
  }
}

export = {
  check: check,
  decode: decode,
  encode: encode
}
