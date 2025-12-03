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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RfController = void 0;
const common_1 = require("@nestjs/common");
const rf_service_1 = require("../services/rf.service");
const calculate_rf_dto_1 = require("../dto/calculate-rf.dto");
let RfController = class RfController {
    rfService;
    constructor(rfService) {
        this.rfService = rfService;
    }
    calculate(dto) {
        return this.rfService.calculate(dto);
    }
};
exports.RfController = RfController;
__decorate([
    (0, common_1.Post)('calculate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_rf_dto_1.CalculateRfDto]),
    __metadata("design:returntype", void 0)
], RfController.prototype, "calculate", null);
exports.RfController = RfController = __decorate([
    (0, common_1.Controller)('rf'),
    __metadata("design:paramtypes", [rf_service_1.RfService])
], RfController);
//# sourceMappingURL=rf.controller.js.map