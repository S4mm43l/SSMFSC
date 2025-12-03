import { FsoMathLogic } from './fso-math.logic';
export declare class RfMathLogic {
    txPowerRF: number;
    unitTxPowerRF: number;
    TxPowerRF: any;
    rxSensitivityRF: number;
    frequencyRF: number;
    gainRF: number;
    fsoLogic: FsoMathLogic;
    constructor(data: any, fsoData: any);
    getFSL(): number;
    private getWeatherAttenuationForCalculating;
    getSi(): number;
    getWeatherAttenuation(): number;
    getMaxLinkDistanceRF(): number;
    isAvailableRF(): boolean;
}
