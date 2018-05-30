/* global describe, it */

let assert = require('assert')
let bip32 = require('bip32')
let bip39 = require('bip39')
let bitcoin = require('../../')

// TODO: remove
let baddress = bitcoin.address
let bcrypto = bitcoin.crypto
function getAddress (node, network) {
  network = network || bitcoin.networks.bitcoin
  return baddress.toBase58Check(bcrypto.hash160(node.publicKey), network.pubKeyHash)
}

describe('bitcoinjs-lib (BIP32)', function () {
  it('can import a BIP32 testnet xpriv and export to WIF', function () {
    var xpriv = 'tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK'
    var node = bip32.fromBase58(xpriv, bitcoin.networks.testnet)

    assert.equal(node.toWIF(), 'cQfoY67cetFNunmBUX5wJiw3VNoYx3gG9U9CAofKE6BfiV1fSRw7')
  })

  it('can export a BIP32 xpriv, then import it', function () {
    var mnemonic = 'praise you muffin lion enable neck grocery crumble super myself license ghost'
    var seed = bip39.mnemonicToSeed(mnemonic)
    var node = bip32.fromSeed(seed)
    var string = node.toBase58()
    var restored = bip32.fromBase58(string)

    assert.equal(getAddress(node), getAddress(restored)) // same public key
    assert.equal(node.toWIF(), restored.toWIF()) // same private key
  })

  it('can export a BIP32 xpub', function () {
    var mnemonic = 'praise you muffin lion enable neck grocery crumble super myself license ghost'
    var seed = bip39.mnemonicToSeed(mnemonic)
    var node = bip32.fromSeed(seed)
    var string = node.neutered().toBase58()

    assert.equal(string, 'xpub661MyMwAqRbcGhVeaVfEBA25e3cP9DsJQZoE8iep5fZSxy3TnPBNBgWnMZx56oreNc48ZoTkQfatNJ9VWnQ7ZcLZcVStpaXLTeG8bGrzX3n')
  })

  it('can create a BIP32, bitcoin, account 0, external address', function () {
    var path = "m/0'/0/0"
    var root = bip32.fromSeed(Buffer.from('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', 'hex'))

    var child1 = root.derivePath(path)

    // option 2, manually
    var child1b = root.deriveHardened(0)
      .derive(0)
      .derive(0)

    assert.equal(getAddress(child1), '1JHyB1oPXufr4FXkfitsjgNB5yRY9jAaa7')
    assert.equal(getAddress(child1b), '1JHyB1oPXufr4FXkfitsjgNB5yRY9jAaa7')
  })

  it('can create a BIP44, bitcoin, account 0, external address', function () {
    var root = bip32.fromSeed(Buffer.from('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', 'hex'))

    var child1 = root.derivePath("m/44'/0'/0'/0/0")

    // option 2, manually
    var child1b = root.deriveHardened(44)
      .deriveHardened(0)
      .deriveHardened(0)
      .derive(0)
      .derive(0)

    assert.equal(getAddress(child1), '12Tyvr1U8A3ped6zwMEU5M8cx3G38sP5Au')
    assert.equal(getAddress(child1b), '12Tyvr1U8A3ped6zwMEU5M8cx3G38sP5Au')
  })

  it('can create a BIP49, bitcoin testnet, account 0, external address', function () {
    var mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
    var seed = bip39.mnemonicToSeed(mnemonic)
    var root = bip32.fromSeed(seed)

    var path = "m/49'/1'/0'/0/0"
    var child = root.derivePath(path)

    var keyhash = bitcoin.crypto.hash160(child.publicKey)
    var scriptSig = bitcoin.script.witnessPubKeyHash.output.encode(keyhash)
    var addressBytes = bitcoin.crypto.hash160(scriptSig)
    var outputScript = bitcoin.script.scriptHash.output.encode(addressBytes)
    var address = bitcoin.address.fromOutputScript(outputScript, bitcoin.networks.testnet)

    assert.equal(address, '2Mww8dCYPUpKHofjgcXcBCEGmniw9CoaiD2')
  })

  it('can use BIP39 to generate BIP32 addresses', function () {
    // var mnemonic = bip39.generateMnemonic()
    var mnemonic = 'praise you muffin lion enable neck grocery crumble super myself license ghost'
    assert(bip39.validateMnemonic(mnemonic))

    var seed = bip39.mnemonicToSeed(mnemonic)
    var root = bip32.fromSeed(seed)

    // receive addresses
    assert.strictEqual(getAddress(root.derivePath("m/0'/0/0")), '1AVQHbGuES57wD68AJi7Gcobc3RZrfYWTC')
    assert.strictEqual(getAddress(root.derivePath("m/0'/0/1")), '1Ad6nsmqDzbQo5a822C9bkvAfrYv9mc1JL')

    // change addresses
    assert.strictEqual(getAddress(root.derivePath("m/0'/1/0")), '1349KVc5NgedaK7DvuD4xDFxL86QN1Hvdn')
    assert.strictEqual(getAddress(root.derivePath("m/0'/1/1")), '1EAvj4edpsWcSer3duybAd4KiR4bCJW5J6')
  })
})
