interface Bip32 {
    public: number;
    private: number;
}

export interface Network {
    name: string;
    coin: TickerSymbol;
    messagePrefix: string;
    bip32: Bip32;
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
    bech32?: string;
    forkId?: number;
    consensusBranchId?: object;
}

export enum TickerSymbol {
    BCH = 'bch',
    BSV = 'bsv',
    BTC = 'btc',
    BTG = 'btg',
    LTC = 'ltc',
    ZEC = 'zec',
    DASH = 'dash'
}

const dash: Network = {
    name: 'Dash',
    messagePrefix: '\x19DarkCoin Signed Message:\n',
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4
    },
    pubKeyHash: 0x4c, // https://dash-docs.github.io/en/developer-reference#opcodes
    scriptHash: 0x10,
    wif: 0xcc,
    coin: TickerSymbol.DASH
};

const dashTest: Network = {
    name: 'Dash Testnet',
    messagePrefix: '\x19DarkCoin Signed Message:\n',
    bip32: {
        public: 0x043587cf,
        private: 0x04358394
    },
    pubKeyHash: 0x8c, // https://dash-docs.github.io/en/developer-reference#opcodes
    scriptHash: 0x13,
    wif: 0xef, // https://github.com/dashpay/godashutil/blob/master/wif.go#L72
    coin: TickerSymbol.DASH
};

const bitcoincash: Network = {
    name: 'Bitcoin Cash',
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
    coin: TickerSymbol.BCH,
    forkId: 0x00
};

const bitcoincashTestnet: Network = {
    name: 'Bitcoin Cash Testnet',
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
        public: 0x043587cf,
        private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    coin: TickerSymbol.BCH
};

const bitcoinsv: Network = {
    name: 'Bitcoin Satoshi Vision',
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
    coin: TickerSymbol.BSV,
    forkId: 0x00
};

const bitcoinsvTestnet: Network = {
    name: 'Bitcoin Satoshi Vision Testnet',
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
        public: 0x043587cf,
        private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    coin: TickerSymbol.BSV
};

const zcash: Network = {
    name: 'Zcash',
    messagePrefix: '\x18ZCash Signed Message:\n',
    bech32: 'bc',
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4
    },
    pubKeyHash: 0x1cb8,
    scriptHash: 0x1cbd,
    wif: 0x80,
    // This parameter was introduced in version 3 to allow soft forks, for version 1 and 2 transactions we add a
    // dummy value.
    consensusBranchId: {
        1: 0x00,
        2: 0x00,
        3: 0x5ba81b19,
        4: 0x76b809bb
    },
    coin: TickerSymbol.ZEC
};

const zcashTest: Network = {
    name: 'Zcash Testnet',
    messagePrefix: '\x18ZCash Signed Message:\n',
    bech32: 'tb',
    bip32: {
        public: 0x043587cf,
        private: 0x04358394
    },
    pubKeyHash: 0x1d25,
    scriptHash: 0x1cba,
    wif: 0xef,
    consensusBranchId: {
        1: 0x00,
        2: 0x00,
        3: 0x5ba81b19,
        4: 0x76b809bb
    },
    coin: TickerSymbol.ZEC
};

const bitcoingold: Network = {
    name: 'Bitcoin Gold',
    messagePrefix: '\x18Bitcoin Gold Signed Message:\n',
    bech32: 'btg',
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4
    },
    pubKeyHash: 0x26,
    scriptHash: 0x17,
    wif: 0x80,
    coin: TickerSymbol.BTG,
    forkId: 0x4F /* 79 */
};

const bitcoin: Network = {
    name: 'Bitcoin',
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
    coin: TickerSymbol.BTC
};

const testnet: Network = {
    name: 'Bitcoin Testnet',
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
        public: 0x043587cf,
        private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    coin: TickerSymbol.BTC
};

const litecoin: Network = {
    name: 'Litecoin',
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
        public: 0x019da462,
        private: 0x019d9cfe
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
    coin: TickerSymbol.LTC
};

export const networks = {
    dash,
    dashTest,
    bitcoincash,
    bitcoincashTestnet,
    bitcoinsv,
    bitcoinsvTestnet,
    zcash,
    zcashTest,
    bitcoingold,
    bitcoin,
    testnet,
    litecoin
};
