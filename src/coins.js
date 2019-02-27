// Coins supported by bitgo-bitcoinjs-lib
const typeforce = require('typeforce')

const coins = {
  BCH: 'bch',
  BSV: 'bsv',
  BTC: 'btc',
  BTG: 'btg',
  LTC: 'ltc',
  ZEC: 'zec',
  DASH: 'dash',
  RVN: 'rvn',
  DYN: 'dyn',
  XBA: 'xba'
}

coins.isBitcoin = function (network) {
  return typeforce.value(coins.BTC)(network.coin)
}

coins.isBitcoinCash = function (network) {
  return typeforce.value(coins.BCH)(network.coin)
}

coins.isBitcoinSV = function (network) {
  return typeforce.value(coins.BSV)(network.coin)
}

coins.isBitcoinGold = function (network) {
  return typeforce.value(coins.BTG)(network.coin)
}

coins.isLitecoin = function (network) {
  return typeforce.value(coins.LTC)(network.coin)
}

coins.isZcash = function (network) {
  return typeforce.value(coins.ZEC)(network.coin)
}
coins.isRavencoin = function (network) {
  return typeforce.value(coins.RVN)(network.coin)
}
coins.isDynamic = function (network) {
  return typeforce.value(coins.DYN)(network.coin)
}
coins.isBitcoinAir = function (network) {
  return typeforce.value(coins.XBA)(network.coin)
}

coins.isValidCoin = typeforce.oneOf(
  coins.isBitcoin,
  coins.isBitcoinCash,
  coins.isBitcoinSV,
  coins.isBitcoinGold,
  coins.isLitecoin,
  coins.isZcash,
  coins.isRavencoin,
  coins.isDynamic,
  coins.isBitcoinAir
)

module.exports = coins
