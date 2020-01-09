const { networks, coins } = require('../..')

class ErrorInvalidFixtures extends Error {
  constructor (network, message) {
    super(
      `invalid fixtures for ${coins.getNetworkName(network)}` +
      (message ? `: ${message}` : '')
    )
  }
}

/**
 * @param {Network} network
 * @param {Network} fileName
 * @returns {Object} fixtures
 */
function getFixturesForNetwork (network, fileName) {
  if (coins.isTestnet(network)) {
    throw new Error(`mainnet and testnet fixtures must be in same directory`)
  }

  if (coins.isBitcoin(network)) {
    return require(`./${fileName}`)
  }

  return require(`./forks/${coins.getNetworkName(network)}/${fileName}`)
}

/**
 * Thrown if fixtures cannot be merged
 */
class ErrorMergeFixtures extends ErrorInvalidFixtures {
  constructor (network, baseValue, value, path) {
    super(
      network,
      `error merging fixtures at path ${path.join('.')}: ` +
      `fork fixture is ${typeof value}, ` +
      `base fixture is ${typeof baseValue}`
    )
  }
}

/**
 * Combines base fixtures with fork fixtures.
 * If forkFixture property is an object and baseFixture has a property with the same name that is also an object,
 * merge both fixtures recursively.
 * If forkFixture property is an array and baseFixture has a property with the same name that is also an array,
 * append elements to baseFixture.
 * Error if property types do not match.
 *
 * @param {Network} network - used in error message
 * @param {Object} baseFixtures - the input fixtures (standard bitcoin fixtures by default)
 * @param {Object} forkFixtures - the fork fixtures. Keys must be subset of baseFixtures and must have same types.
 * @param {string[]?} path - used in error message
 * @returns {Object} merged fixtures
 */
function mergeFixtures (network, baseFixtures, forkFixtures, path = []) {
  const merged = {}
  for (const key in forkFixtures) {
    const keyPath = [...path, key]
    const baseValue = baseFixtures[key]
    const forkValue = forkFixtures[key]

    if (Array.isArray(forkValue)) {
      if (!Array.isArray(baseValue)) {
        throw new ErrorMergeFixtures(network, baseValue, forkValue, keyPath)
      }

      merged[key] = [...baseValue, ...forkValue]
    } else if (typeof forkValue === 'object') {
      if (typeof baseValue !== 'object') {
        throw new ErrorMergeFixtures(network, baseValue, forkValue, keyPath)
      }

      merged[key] = mergeFixtures(network, baseValue, forkValue, keyPath)
    } else {
      throw new ErrorMergeFixtures(network, baseValue, forkValue, keyPath)
    }
  }

  return Object.assign({}, baseFixtures, merged)
}

/**
 *
 * @param {Network[]} forkNetworks - networks (beside bitcoin) to load fixtures for
 * @param {string} fileName - the fixture file name
 * @param {Function} combineFunc - combinator function.
 *                                 Receives arguments (acc: Fixtures, network: Network, fixtures: Fixtures) and
 *                                 returns combined value of `acc` and `fixtures`.
 *                                 Will be called with bitcoin fixtures on first call.
 * @returns {Object}
 */
  // FIXME(BG-16846): add fixtures for all coins, remove `forkNetworks`
function combineFixtureFiles (forkNetworks, fileName, combineFunc) {
  return forkNetworks
    .reduce(
      (acc, network) => combineFunc(acc, network, getFixturesForNetwork(network, fileName)),
      getFixturesForNetwork(networks.bitcoin, fileName)
    )
}

/**
 * @returns {Object} combined fixtures for TransactionBuilder tests
 */
function getFixturesTransactionBuilder () {
  return combineFixtureFiles(
    [networks.dash, networks.zcash],
    'transaction_builder',
    (baseFixtures, network, forkFixtures) => {
      if ((typeof baseFixtures.valid) !== 'object') {
        throw new ErrorInvalidFixtures(network)
      }

      return mergeFixtures(network, baseFixtures, forkFixtures)
    }
  )
}

module.exports = {
  ErrorInvalidFixtures,
  ErrorMergeFixtures,
  mergeFixtures,
  getFixturesTransactionBuilder
}
