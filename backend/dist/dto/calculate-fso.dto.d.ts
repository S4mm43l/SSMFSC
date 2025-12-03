import { EnumModel, EnumAirTurbulence, EnumCalcMethod } from '../logic/fso-math.logic';
export declare class CalculateFsoDto {
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
