export enum EnumModel {
  Kim = 'Kim',
  Kruse = 'Kruse',
}

export enum EnumAirTurbulence {
  Calm = 'Calm',
  VeryWeak = 'VeryWeak',
  Weak = 'Weak',
}

export enum EnumCalcMethod {
  weatherCondition = 'weatherCondition',
  additiveAttenuation = 'additiveAttenuation',
}

export class FsoMathLogic {
  private static readonly PI = Math.PI;

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

  constructor(data: any) {
    Object.assign(this, data);
  }

  public calculateAttenuationParticles(): number {
    const tempVzdialenost =
      this.jednotkaVzdialenosti === 0
        ? this.vzdialenost * 1000
        : this.vzdialenost;
    return (0.5 * tempVzdialenost) / 1000;
  }

  private getStructuralParameterIL(): number {
    switch (this.airTurbulence) {
      case EnumAirTurbulence.Calm:
        return Math.pow(10, -16);
      case EnumAirTurbulence.VeryWeak:
        return Math.pow(10, -15);
      case EnumAirTurbulence.Weak:
        return Math.pow(10, -16);
      default:
        return 0;
    }
  }

  private getRefractiveIndex(): number {
    const tempVzdialenost =
      this.jednotkaVzdialenosti === 0
        ? this.vzdialenost * 1000
        : this.vzdialenost;
    return (
      0.5 *
      this.getStructuralParameterIL() *
      Math.pow((2.0 * Math.PI) / (this.vlnovaDlzka * 0.000000001), 7.0 / 6.0) *
      Math.pow(tempVzdialenost, 11.0 / 6.0)
    );
  }

  public calculateAttenuationTurbulence(): number {
    const refractiveIndex = this.getRefractiveIndex();
    const sqrtValue = Math.sqrt(refractiveIndex);
    const logInput = 1 - sqrtValue;
    
    const result = 10 * Math.log10(logInput);
    return Math.abs(result);
  }

  public calculateGeometricAttenuation(): number {
    const tempVzdialenost =
      this.jednotkaVzdialenosti === 0
        ? this.vzdialenost * 1000
        : this.vzdialenost;
    
  
    const part1 = 20 * Math.log10(this.priemer / 100 / (this.smerovost / 1000));
    const part2 = 20 * Math.log10(tempVzdialenost);
    return Math.abs(part1 - part2);
  }

  public calculateClearAtmosphereAttenuation(): number {
    return (
      this.calculateAttenuationParticles() +
      this.calculateAttenuationTurbulence() +
      this.calculateGeometricAttenuation()
    );
  }

  public calculateScatteringAttenuation(): number {
    let q = 0.0;

    const tempViditelnost = this.viditelnost;

    switch (this.model) {
      case EnumModel.Kim:
        if (tempViditelnost < 0.5) q = 0.0;
        else if (tempViditelnost < 1.0) q = tempViditelnost - 0.5;
        else if (tempViditelnost < 6.0) q = 0.16 * tempViditelnost + 0.34;
        else if (tempViditelnost < 50.0) q = 1.3;
        else q = 1.6;
        break;
      case EnumModel.Kruse:
        if (tempViditelnost < 6.0)
          q = 0.585 * Math.pow(tempViditelnost, 1.0 / 3.0);
        else if (tempViditelnost < 50.0) q = 1.3;
        else q = 1.6;
        break;
      default:
        return 0;
    }

    return (17.334 / tempViditelnost) * Math.pow(this.vlnovaDlzka / 550.0, -q);
  }

  public calculateRainAttenuation(): number {
    return Math.pow(1.076 * this.dazd, 2.0 / 3.0);
  }

  public calculateDrySnowAttenuation(): number {
    return (
      (0.0000542 * this.vlnovaDlzka + 5.4958776) *
      Math.pow(this.suchySneh, 1.38)
    );
  }

  public calculateWetSnowAttenuation(): number {
    return (
      (0.0001023 * this.vlnovaDlzka + 3.7855466) *
      Math.pow(this.mokrySneh, 0.72)
    );
  }

  public calculateAtmosphericConditionsAttenuation(): number {
    if (this.adtUtlmMethod === EnumCalcMethod.weatherCondition) {
      return (
        this.calculateScatteringAttenuation() +
        this.calculateRainAttenuation() +
        this.calculateDrySnowAttenuation() +
        this.calculateWetSnowAttenuation()
      );
    } else {
      return this.aditivnyUtlm;
    }
  }

  public calculateLinkMargin(): number {
    const tempVykon =
      this.jednotkaVykonu === 0
        ? 10 * Math.log10(this.vykon / 1000) + 30
        : this.vykon;
    return (
      tempVykon -
      this.citlivost -
      this.calculateGeometricAttenuation() +
      3.67 -
      this.calculateAttenuationParticles() -
      this.calculateAttenuationTurbulence()
    );
  }

  public calculateNormalizedLinkMargin(): number {
    const tempVzdialenost =
      this.jednotkaVzdialenosti === 0
        ? this.vzdialenost * 1000
        : this.vzdialenost;
    return this.calculateLinkMargin() / (tempVzdialenost / 1000);
  }

  public isLinkAvailable(): boolean {
    return (
      this.calculateNormalizedLinkMargin() >
      this.calculateAtmosphericConditionsAttenuation()
    );
  }

  public calculateMaxLinkDistance(): number {
    let tempVzdialenost =
      this.jednotkaVzdialenosti === 0
        ? this.vzdialenost * 1000
        : this.vzdialenost;

    const tempVykon =
      this.jednotkaVykonu === 0
        ? 10 * Math.log10(this.vykon / 1000) + 30
        : this.vykon;

    if (
      this.calculateNormalizedLinkMargin() <
      this.calculateAtmosphericConditionsAttenuation()
    ) {
      tempVzdialenost = 1;
    }

    const calcGeom = (dist: number) =>
      Math.abs(
        20 * Math.log10(this.priemer / 100 / (this.smerovost / 1000)) -
          20 * Math.log10(dist),
      );

    const calcTurb = (dist: number) => {
      const indexLomu =
        0.5 *
        this.getStructuralParameterIL() *
        Math.pow(
          (2.0 * Math.PI) / (this.vlnovaDlzka * 0.000000001),
          7.0 / 6.0,
        ) *
        Math.pow(dist, 11.0 / 6.0);
      return Math.abs(10 * Math.log10(1 - Math.sqrt(indexLomu)));
    };

    const calcParticles = (dist: number) => (0.5 * dist) / 1000;

    let currentAtten = this.calculateAtmosphericConditionsAttenuation();

    while (true) {
      const geom = calcGeom(tempVzdialenost);
      const turb = calcTurb(tempVzdialenost);
      const part = calcParticles(tempVzdialenost);

      const margin =
        (tempVykon - this.citlivost - geom - turb - part + 3.67) /
        (tempVzdialenost / 1000);

      if (currentAtten >= margin) break;

      tempVzdialenost++;

      if (tempVzdialenost > 100000) break;
    }

    return tempVzdialenost - 2;
  }
}
