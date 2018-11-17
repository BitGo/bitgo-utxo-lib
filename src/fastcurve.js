var ECSignature = require('./ecsignature')

var secp256k1
var available = false
try {
  // secp256k1 is an optional native module used for accelerating
  // low-level elliptic curve operations. It's nice to have, but
  // we can live without it too
  secp256k1 = require('secp256k1')
  available = true
} catch (e) {
  // secp256k1 is not available, this is alright
}

/**
 * Derive a public key from a 32 byte private key buffer.
 *
 * Uses secp256k1 for acceleration. If secp256k1 is not available,
 * this function returns undefined.
 *
 * @param buffer {Buffer} Private key buffer
 * @param compressed {Boolean} Whether the public key should be compressed
 * @return {undefined}
 */
var publicKeyCreate = function (buffer, compressed) {
  if (!available) {
    return undefined
  }

  return secp256k1.publicKeyCreate(buffer, compressed)
}

var sign = function (hash, d) {
  if (!available) {
    return undefined
  }

  var sig = secp256k1.sign(hash, d.toBuffer(32)).signature
  return ECSignature.fromDER(secp256k1.signatureExport(sig))
}

var verify = function (hash, sig, pubkey) {
  if (!available) {
    return undefined
  }

  sig = new ECSignature(sig.r, sig.s)
  sig = secp256k1.signatureNormalize(secp256k1.signatureImport(sig.toDER()))
  return secp256k1.verify(hash, sig, pubkey)
}

module.exports = {
  available: available,
  publicKeyCreate: publicKeyCreate,
  sign: sign,
  verify: verify
}
