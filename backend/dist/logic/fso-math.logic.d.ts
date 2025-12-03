export declare enum EnumModel {
    Kim = "Kim",
    Kruse = "Kruse"
}
export declare enum EnumAirTurbulence {
    Calm = "Calm",
    VeryWeak = "VeryWeak",
    Weak = "Weak"
}
export declare enum EnumCalcMethod {
    weatherCondition = "weatherCondition",
    additiveAttenuation = "additiveAttenuation"
}
export declare class FsoMathLogic {
    private static readonly PI;
    model: EnumModel;
    airTurbulence: EnumAirTurbulence;
    adtUtlmMethod: EnumCalcMethod;
    vykon: number;
    jednotkaVykonu: number;
    citlivost: number;
    priemer: number;
    smerovost: number;
    vlnovaDlzka: number;
    vzdialenost: number;
    jednotkaVzdialenosti: number;
    viditelnost: number;
    dazd: number;
    suchySneh: number;
    mokrySneh: number;
    aditivnyUtlm: number;
    constructor(data: any);
    calculateAttenuationParticles(): number;
    private getStructuralParameterIL;
    private getRefractiveIndex;
    calculateAttenuationTurbulence(): number;
    calculateGeometricAttenuation(): number;
    calculateClearAtmosphereAttenuation(): number;
    calculateScatteringAttenuation(): number;
    calculateRainAttenuation(): number;
    calculateDrySnowAttenuation(): number;
    calculateWetSnowAttenuation(): number;
    calculateAtmosphericConditionsAttenuation(): number;
    calculateLinkMargin(): number;
    calculateNormalizedLinkMargin(): number;
    isLinkAvailable(): boolean;
    calculateMaxLinkDistance(): number;
}
