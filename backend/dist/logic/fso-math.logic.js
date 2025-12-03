"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FsoMathLogic = exports.EnumCalcMethod = exports.EnumAirTurbulence = exports.EnumModel = void 0;
var EnumModel;
(function (EnumModel) {
    EnumModel["Kim"] = "Kim";
    EnumModel["Kruse"] = "Kruse";
})(EnumModel || (exports.EnumModel = EnumModel = {}));
var EnumAirTurbulence;
(function (EnumAirTurbulence) {
    EnumAirTurbulence["Calm"] = "Calm";
    EnumAirTurbulence["VeryWeak"] = "VeryWeak";
    EnumAirTurbulence["Weak"] = "Weak";
})(EnumAirTurbulence || (exports.EnumAirTurbulence = EnumAirTurbulence = {}));
var EnumCalcMethod;
(function (EnumCalcMethod) {
    EnumCalcMethod["weatherCondition"] = "weatherCondition";
    EnumCalcMethod["additiveAttenuation"] = "additiveAttenuation";
})(EnumCalcMethod || (exports.EnumCalcMethod = EnumCalcMethod = {}));
class FsoMathLogic {
    static PI = Math.PI;
    model;
    airTurbulence;
    adtUtlmMethod;
    vykon;
    jednotkaVykonu;
    citlivost;
    priemer;
    smerovost;
    vlnovaDlzka;
    vzdialenost;
    jednotkaVzdialenosti;
    viditelnost;
    dazd;
    suchySneh;
    mokrySneh;
    aditivnyUtlm;
    constructor(data) {
        Object.assign(this, data);
    }
    calculateAttenuationParticles() {
        const tempVzdialenost = this.jednotkaVzdialenosti === 0
            ? this.vzdialenost * 1000
            : this.vzdialenost;
        return (0.5 * tempVzdialenost) / 1000;
    }
    getStructuralParameterIL() {
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
    getRefractiveIndex() {
        const tempVzdialenost = this.jednotkaVzdialenosti === 0
            ? this.vzdialenost * 1000
            : this.vzdialenost;
        return (0.5 *
            this.getStructuralParameterIL() *
            Math.pow((2.0 * Math.PI) / (this.vlnovaDlzka * 0.000000001), 7.0 / 6.0) *
            Math.pow(tempVzdialenost, 11.0 / 6.0));
    }
    calculateAttenuationTurbulence() {
        const refractiveIndex = this.getRefractiveIndex();
        const sqrtValue = Math.sqrt(refractiveIndex);
        const logInput = 1 - sqrtValue;
        const result = 10 * Math.log10(logInput);
        return Math.abs(result);
    }
    calculateGeometricAttenuation() {
        const tempVzdialenost = this.jednotkaVzdialenosti === 0
            ? this.vzdialenost * 1000
            : this.vzdialenost;
        const part1 = 20 * Math.log10(this.priemer / 100 / (this.smerovost / 1000));
        const part2 = 20 * Math.log10(tempVzdialenost);
        return Math.abs(part1 - part2);
    }
    calculateClearAtmosphereAttenuation() {
        return (this.calculateAttenuationParticles() +
            this.calculateAttenuationTurbulence() +
            this.calculateGeometricAttenuation());
    }
    calculateScatteringAttenuation() {
        let q = 0.0;
        const tempViditelnost = this.viditelnost;
        switch (this.model) {
            case EnumModel.Kim:
                if (tempViditelnost < 0.5)
                    q = 0.0;
                else if (tempViditelnost < 1.0)
                    q = tempViditelnost - 0.5;
                else if (tempViditelnost < 6.0)
                    q = 0.16 * tempViditelnost + 0.34;
                else if (tempViditelnost < 50.0)
                    q = 1.3;
                else
                    q = 1.6;
                break;
            case EnumModel.Kruse:
                if (tempViditelnost < 6.0)
                    q = 0.585 * Math.pow(tempViditelnost, 1.0 / 3.0);
                else if (tempViditelnost < 50.0)
                    q = 1.3;
                else
                    q = 1.6;
                break;
            default:
                return 0;
        }
        return (17.334 / tempViditelnost) * Math.pow(this.vlnovaDlzka / 550.0, -q);
    }
    calculateRainAttenuation() {
        return Math.pow(1.076 * this.dazd, 2.0 / 3.0);
    }
    calculateDrySnowAttenuation() {
        return ((0.0000542 * this.vlnovaDlzka + 5.4958776) *
            Math.pow(this.suchySneh, 1.38));
    }
    calculateWetSnowAttenuation() {
        return ((0.0001023 * this.vlnovaDlzka + 3.7855466) *
            Math.pow(this.mokrySneh, 0.72));
    }
    calculateAtmosphericConditionsAttenuation() {
        if (this.adtUtlmMethod === EnumCalcMethod.weatherCondition) {
            return (this.calculateScatteringAttenuation() +
                this.calculateRainAttenuation() +
                this.calculateDrySnowAttenuation() +
                this.calculateWetSnowAttenuation());
        }
        else {
            return this.aditivnyUtlm;
        }
    }
    calculateLinkMargin() {
        const tempVykon = this.jednotkaVykonu === 0
            ? 10 * Math.log10(this.vykon / 1000) + 30
            : this.vykon;
        return (tempVykon -
            this.citlivost -
            this.calculateGeometricAttenuation() +
            3.67 -
            this.calculateAttenuationParticles() -
            this.calculateAttenuationTurbulence());
    }
    calculateNormalizedLinkMargin() {
        const tempVzdialenost = this.jednotkaVzdialenosti === 0
            ? this.vzdialenost * 1000
            : this.vzdialenost;
        return this.calculateLinkMargin() / (tempVzdialenost / 1000);
    }
    isLinkAvailable() {
        return (this.calculateNormalizedLinkMargin() >
            this.calculateAtmosphericConditionsAttenuation());
    }
    calculateMaxLinkDistance() {
        let tempVzdialenost = this.jednotkaVzdialenosti === 0
            ? this.vzdialenost * 1000
            : this.vzdialenost;
        const tempVykon = this.jednotkaVykonu === 0
            ? 10 * Math.log10(this.vykon / 1000) + 30
            : this.vykon;
        if (this.calculateNormalizedLinkMargin() <
            this.calculateAtmosphericConditionsAttenuation()) {
            tempVzdialenost = 1;
        }
        const calcGeom = (dist) => Math.abs(20 * Math.log10(this.priemer / 100 / (this.smerovost / 1000)) -
            20 * Math.log10(dist));
        const calcTurb = (dist) => {
            const indexLomu = 0.5 *
                this.getStructuralParameterIL() *
                Math.pow((2.0 * Math.PI) / (this.vlnovaDlzka * 0.000000001), 7.0 / 6.0) *
                Math.pow(dist, 11.0 / 6.0);
            return Math.abs(10 * Math.log10(1 - Math.sqrt(indexLomu)));
        };
        const calcParticles = (dist) => (0.5 * dist) / 1000;
        let currentAtten = this.calculateAtmosphericConditionsAttenuation();
        while (true) {
            const geom = calcGeom(tempVzdialenost);
            const turb = calcTurb(tempVzdialenost);
            const part = calcParticles(tempVzdialenost);
            const margin = (tempVykon - this.citlivost - geom - turb - part + 3.67) /
                (tempVzdialenost / 1000);
            if (currentAtten >= margin)
                break;
            tempVzdialenost++;
            if (tempVzdialenost > 100000)
                break;
        }
        return tempVzdialenost - 2;
    }
}
exports.FsoMathLogic = FsoMathLogic;
//# sourceMappingURL=fso-math.logic.js.map