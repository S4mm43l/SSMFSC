import { EnumModel, EnumAirTurbulence, EnumCalcMethod } from '../logic/fso-math.logic';
export declare class CalculateStatisticalDto {
    beginDate: string;
    endDate: string;
    maxDensityOfFog: number;
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
}
export declare class GetGraphDataDto {
    beginDate: string;
    endDate: string;
    type: 'fog' | 'temperature' | 'humidity';
}
export declare class GetTableDataDto {
    date: string;
}
