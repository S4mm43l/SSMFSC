"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticalMathLogic = void 0;
class StatisticalMathLogic {
    maxDensityOfFog;
    constructor(maxDensityOfFog) {
        this.maxDensityOfFog = maxDensityOfFog;
    }
    calculate(fogValues) {
        let tmpPocetSekund = 0;
        for (let i = 0; i < fogValues.length; i++) {
            let tmpFog = fogValues[i];
            tmpFog = (((tmpFog * 5.0) / 1024.0 - 0.87) * 0.5) / 2.9;
            if (tmpFog < 0)
                tmpFog = 0;
            if (tmpFog > this.maxDensityOfFog) {
                tmpPocetSekund += 8.33;
            }
        }
        const numSecondsUnavailability = Math.ceil(tmpPocetSekund);
        const fadeProbability = fogValues.length > 0
            ? numSecondsUnavailability / (fogValues.length * 8.33)
            : 0;
        const fadeProb = fogValues.length > 0 ? numSecondsUnavailability / fogValues.length : 0;
        const linkAvailability = (1 - fadeProb) * 100;
        return {
            numSecondsUnavailability,
            fadeProbability: Number(fadeProb.toFixed(6)),
            linkAvailability: Number(linkAvailability.toFixed(6)),
        };
    }
}
exports.StatisticalMathLogic = StatisticalMathLogic;
//# sourceMappingURL=statistical-math.logic.js.map