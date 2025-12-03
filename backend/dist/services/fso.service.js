"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FsoService = void 0;
const common_1 = require("@nestjs/common");
const fso_math_logic_1 = require("../logic/fso-math.logic");
const serialize_numbers_util_1 = require("../utils/serialize-numbers.util");
let FsoService = class FsoService {
    calculate(dto) {
        const logic = new fso_math_logic_1.FsoMathLogic(dto);
        const result = {
            alfaAtm: logic.calculateAttenuationParticles(),
            alfaTurb: logic.calculateAttenuationTurbulence(),
            alfaGeom: logic.calculateGeometricAttenuation(),
            alfaClearTotal: logic.calculateClearAtmosphereAttenuation(),
            alfaAtmAddNorm: 0,
            alfaRainNorm: 0,
            alfaSnowDryNorm: 0,
            alfaSnowWetNorm: 0,
            alfaAddTotalNorm: logic.calculateAtmosphericConditionsAttenuation(),
            linkMargin: logic.calculateLinkMargin(),
            normLinkMargin: logic.calculateNormalizedLinkMargin(),
            linkStatus: logic.isLinkAvailable() ? 'Link OK' : 'Link DOWN',
            maxLinkDistance: logic.calculateMaxLinkDistance(),
        };
        if (dto.adtUtlmMethod === fso_math_logic_1.EnumCalcMethod.weatherCondition) {
            result.alfaAtmAddNorm = logic.calculateScatteringAttenuation();
            result.alfaRainNorm = logic.calculateRainAttenuation();
            result.alfaSnowDryNorm = logic.calculateDrySnowAttenuation();
            result.alfaSnowWetNorm = logic.calculateWetSnowAttenuation();
        }
        return (0, serialize_numbers_util_1.serializeSpecialNumbers)(result);
    }
};
exports.FsoService = FsoService;
exports.FsoService = FsoService = __decorate([
    (0, common_1.Injectable)()
], FsoService);
//# sourceMappingURL=fso.service.js.map