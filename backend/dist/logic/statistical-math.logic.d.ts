export declare class StatisticalMathLogic {
    maxDensityOfFog: number;
    constructor(maxDensityOfFog: number);
    calculate(fogValues: number[]): {
        numSecondsUnavailability: number;
        fadeProbability: number;
        linkAvailability: number;
    };
}
