import { FsoMathLogic } from './fso-math.logic';

export class RfMathLogic {
  txPowerRF: number;
  unitTxPowerRF: number;
  TxPowerRF;

  rxSensitivityRF: number;
  frequencyRF: number;
  gainRF: number;

  fsoLogic: FsoMathLogic;

  constructor(data: any, fsoData: any) {
    Object.assign(this, data);
    this.fsoLogic = new FsoMathLogic(fsoData);
  }

  public getFSL(): number {
    return (
      20.0 * Math.log10(this.fsoLogic.vzdialenost) +
      20.0 * Math.log10(this.frequencyRF) +
      32.45
    );
  }

  private getWeatherAttenuationForCalculating(): number {
    let aWeatherFactor = 0.0;
    let bWeatherFactor = 0.0;

    if (this.frequencyRF >= 2900 && this.frequencyRF <= 54000) {
      aWeatherFactor =
        4.21 * Math.pow(10.0, -5.0) * Math.pow(this.frequencyRF / 1000.0, 2.42);
    } else if (this.frequencyRF > 54000 && this.frequencyRF <= 180000) {
      aWeatherFactor =
        4.09 *
        Math.pow(10.0, -2.0) *
        Math.pow(this.frequencyRF / 1000.0, 0.669);
    }

    if (this.frequencyRF >= 8500 && this.frequencyRF <= 25000) {
      bWeatherFactor = 1.41 * Math.pow(this.frequencyRF / 1000.0, -0.0779);
    } else if (this.frequencyRF > 25000 && this.frequencyRF < 164000) {
      bWeatherFactor = 2.63 * Math.pow(this.frequencyRF / 1000.0, -0.272);
    }

    if (this.frequencyRF >= 57000 && this.frequencyRF <= 63000) {
      return (
        aWeatherFactor * Math.pow(this.fsoLogic.dazd, bWeatherFactor) +
        this.fsoLogic.vzdialenost * 15.0
      );
    } else {
      return aWeatherFactor * Math.pow(this.fsoLogic.dazd, bWeatherFactor);
    }
  }

  public getSi(): number {
    let tempVykon;
    if (this.unitTxPowerRF === 0) {
      tempVykon = 10 * Math.log10(this.txPowerRF) + 30;
    } else {
      tempVykon = this.txPowerRF;
    }

    const UTLM_KONCOVIEK = 2.0;
    const UTLM_ROZSAH_LINKY = 45.0;

    return (
      tempVykon +
      2.0 * this.gainRF -
      this.getFSL() -
      UTLM_KONCOVIEK -
      this.getWeatherAttenuationForCalculating() * this.fsoLogic.vzdialenost -
      UTLM_ROZSAH_LINKY
    );
  }

  public getWeatherAttenuation(): number {
    if (this.frequencyRF >= 57000 && this.frequencyRF <= 63000) {
      return this.getWeatherAttenuationForCalculating();
    } else {
      return (
        this.getWeatherAttenuationForCalculating() * this.fsoLogic.vzdialenost
      );
    }
  }

  public getMaxLinkDistanceRF(): number {
    let tempVykon;
    if (this.unitTxPowerRF === 0) {
      tempVykon = 10 * Math.log10(this.txPowerRF) + 30;
    } else {
      tempVykon = this.txPowerRF;
    }

    const UTLM_KONCOVIEK = 2.0;
    const UTLM_ROZSAH_LINKY = 45.0;
    let tempDistance = 0.001;

    let aWeatherFactor = 0.0;
    let bWeatherFactor = 0.0;

    if (this.frequencyRF >= 2900 && this.frequencyRF <= 54000) {
      aWeatherFactor =
        4.21 * Math.pow(10.0, -5.0) * Math.pow(this.frequencyRF / 1000.0, 2.42);
    } else if (this.frequencyRF > 54000 && this.frequencyRF <= 180000) {
      aWeatherFactor =
        4.09 *
        Math.pow(10.0, -2.0) *
        Math.pow(this.frequencyRF / 1000.0, 0.669);
    }

    if (this.frequencyRF >= 8500 && this.frequencyRF <= 25000) {
      bWeatherFactor = 1.41 * Math.pow(this.frequencyRF / 1000.0, -0.0779);
    } else if (this.frequencyRF > 25000 && this.frequencyRF < 164000) {
      bWeatherFactor = 2.63 * Math.pow(this.frequencyRF / 1000.0, -0.272);
    }

    const checkSi = (dist: number) => {
      const fsl =
        20 * Math.log10(dist) + 20 * Math.log10(this.frequencyRF) + 32.45;
      let weatherAtten = 0;
      if (this.frequencyRF >= 57000 && this.frequencyRF <= 63000) {
        weatherAtten =
          (aWeatherFactor * Math.pow(this.fsoLogic.dazd, bWeatherFactor) +
            dist * 15) *
          dist;
      } else {
        weatherAtten =
          aWeatherFactor * Math.pow(this.fsoLogic.dazd, bWeatherFactor) * dist;
      }

      let wAtten = 0;
      if (this.frequencyRF >= 57000 && this.frequencyRF <= 63000) {
        wAtten =
          (aWeatherFactor * Math.pow(this.fsoLogic.dazd, bWeatherFactor) +
            dist * 15) *
          dist;
      } else {
        wAtten =
          aWeatherFactor * Math.pow(this.fsoLogic.dazd, bWeatherFactor) * dist;
      }

      return (
        tempVykon +
        2 * this.gainRF -
        fsl -
        UTLM_KONCOVIEK -
        wAtten -
        UTLM_ROZSAH_LINKY
      );
    };

    while (checkSi(tempDistance) > this.rxSensitivityRF) {
      tempDistance += 0.001;
      if (tempDistance > 1000) break;
    }

    return tempDistance * 1000 - 1;
  }

  public isAvailableRF(): boolean {
    return this.getSi() >= this.rxSensitivityRF;
  }
}
