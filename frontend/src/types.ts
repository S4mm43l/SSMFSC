export const EnumModel = {
  Kim: 'Kim',
  Kruse: 'Kruse',
} as const;
export type EnumModel = typeof EnumModel[keyof typeof EnumModel];

export const EnumAirTurbulence = {
  Calm: 'Calm',
  VeryWeak: 'VeryWeak',
  Weak: 'Weak',
} as const;
export type EnumAirTurbulence = typeof EnumAirTurbulence[keyof typeof EnumAirTurbulence];

export const EnumCalcMethod = {
  weatherCondition: 'weatherCondition',
  additiveAttenuation: 'additiveAttenuation',
} as const;
export type EnumCalcMethod = typeof EnumCalcMethod[keyof typeof EnumCalcMethod];

export interface FsoSystem {
  id: number;
  name: string;
  txPower: number;
  txPowerUnit: string;
  rxSensitivity: number;
  rxLensDiameter: number;
  directivity: number;
  wavelength: number;
  companyName: string;
}

export interface RfSystem {
  id: number;
  name: string;
  txPower: number;
  txPowerUnit: string;
  rxSensitivity: number;
  frequency: number;
  gain: number;
  companyName: string;
}
