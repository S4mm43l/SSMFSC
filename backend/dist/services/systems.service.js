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
exports.SystemsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../modules/supabase/supabase.service");
let SystemsService = class SystemsService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async getFsoSystems() {
        return [
            {
                id: 1,
                name: 'MRV TS5000/155',
                txPower: 140,
                txPowerUnit: 'mW',
                rxSensitivity: -36,
                rxLensDiameter: 20,
                directivity: 4,
                wavelength: 850,
                companyName: 'MRV',
            },
            {
                id: 2,
                name: 'FlightStrata 155E',
                txPower: 140,
                txPowerUnit: 'mW',
                rxSensitivity: -32,
                rxLensDiameter: 20,
                directivity: 4,
                wavelength: 850,
                companyName: 'LightPointe',
            },
            {
                id: 3,
                name: 'Canobeam DT-110',
                txPower: 20,
                txPowerUnit: 'mW',
                rxSensitivity: -34,
                rxLensDiameter: 20,
                directivity: 4,
                wavelength: 785,
                companyName: 'Canon',
            },
        ];
    }
    async getRfSystems() {
        return [
            {
                id: 1,
                name: 'WTM 6000',
                txPower: 20,
                txPowerUnit: 'dBm',
                rxSensitivity: -71,
                frequency: 6000,
                gain: 0,
                companyName: 'Harris Stratex',
            },
            {
                id: 2,
                name: 'ALCOMA AL80GE',
                txPower: 18,
                txPowerUnit: 'dBm',
                rxSensitivity: -70,
                frequency: 80000,
                gain: 43,
                companyName: 'ALCOMA',
            },
        ];
    }
};
exports.SystemsService = SystemsService;
exports.SystemsService = SystemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], SystemsService);
//# sourceMappingURL=systems.service.js.map