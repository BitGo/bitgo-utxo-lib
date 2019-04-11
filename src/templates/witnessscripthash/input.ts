// <scriptSig> {serialized scriptPubKey script}

var bscript = require('../../script')

var p2ms = require('../multisig/')
var p2pk = require('../pubkey/')
var p2pkh = require('../pubkeyhash/')

function check (chunks: Buffer, allowIncomplete: boolean = true) {
  // typeforce(types.Array, chunks)
  if (chunks.length < 1) return false

  var witnessScript = chunks[chunks.length - 1]
  if (!Buffer.isBuffer(witnessScript)) return false

  var witnessScriptChunks = bscript.decompile(witnessScript)

  // is witnessScript a valid script?
  if (witnessScriptChunks.length === 0) return false

  var witnessRawScriptSig = bscript.compile(chunks.slice(0, -1))

  // match types
  if (p2pkh.input.check(witnessRawScriptSig) &&
    p2pkh.output.check(witnessScriptChunks)) return true

  if (p2ms.input.check(witnessRawScriptSig, allowIncomplete) &&
    p2ms.output.check(witnessScriptChunks)) return true

  if (p2pk.input.check(witnessRawScriptSig) &&
    p2pk.output.check(witnessScriptChunks)) return true

  return false
}
check.toJSON = function () { return 'witnessScriptHash input' }

function encodeStack (witnessData: Buffer, witnessScript: Buffer) {
  // typeforce({
  //   witnessData: [types.Buffer],
  //   witnessScript: types.Buffer
  // }, {
  //   witnessData: witnessData,
  //   witnessScript: witnessScript
  // })

  return [].concat(witnessData, witnessScript)
}

function decodeStack (chunks) {
  if (!check(chunks)) {
    throw Error('Check failed');
  }
  return {
    witnessData: chunks.slice(0, -1),
    witnessScript: chunks[chunks.length - 1]
  }
}

export = {
  check: check,
  decodeStack: decodeStack,
  encodeStack: encodeStack
}
