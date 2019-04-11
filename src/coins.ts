import { Network, TickerSymbol } from "./networks";

export class Coins {
    static isBitcoin(network: Network): boolean {
        if (network === undefined) {
            return true;
        }
        return network.coin === TickerSymbol.BTC;
    }

    static isBitcoinCash(network: Network) {
        if (network === undefined) {
            return false;
        }
        return network.coin === TickerSymbol.BCH;
    };

    static isBitcoinSV(network: Network) {
        if (network === undefined) {
            return false;
        }
        return network.coin === TickerSymbol.BSV;
    };

    static isBitcoinGold(network: Network) {
        if (network === undefined) {
            return false;
        }
        return network.coin === TickerSymbol.BTG;
    };

    static isLitecoin(network: Network) {
        if (network === undefined) {
            return false;
        }
        return network.coin === TickerSymbol.LTC;
    };

    static isZcash(network: Network) {
        if (network === undefined) {
            return false;
        }
        return network.coin === TickerSymbol.ZEC;
    };
}
