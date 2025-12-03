"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RfService = void 0;
const common_1 = require("@nestjs/common");
const rf_math_logic_1 = require("../logic/rf-math.logic");
const fso_service_1 = require("./fso.service");
const serialize_numbers_util_1 = require("../utils/serialize-numbers.util");
let RfService = class RfService {
    fsoService;
    constructor(fsoService) {
        this.fsoService = fsoService;
    }
    calculate(dto) {
        const fsoResult = this.fsoService.calculate(dto);
        const logic = new rf_math_logic_1.RfMathLogic(dto, dto);
        const rfResult = {
            si: logic.getSi(),
            fsl: logic.getFSL(),
            weatherAttenuation: logic.getWeatherAttenuation(),
            maxLinkDistance: logic.getMaxLinkDistanceRF(),
            linkStatus: logic.isAvailableRF() ? 'Link OK' : 'Link DOWN',
        };
        return (0, serialize_numbers_util_1.serializeSpecialNumbers)({
            fso: fsoResult,
            rf: rfResult,
        });
    }
};
exports.RfService = RfService;
exports.RfService = RfService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [fso_service_1.FsoService])
], RfService);
//# sourceMappingURL=rf.service.js.map