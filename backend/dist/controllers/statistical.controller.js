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
exports.StatisticalController = void 0;
const common_1 = require("@nestjs/common");
const statistical_service_1 = require("../services/statistical.service");
const calculate_statistical_dto_1 = require("../dto/calculate-statistical.dto");
let StatisticalController = class StatisticalController {
    service;
    constructor(service) {
        this.service = service;
    }
    calculate(dto) {
        return this.service.calculate(dto);
    }
    getGraphData(dto) {
        return this.service.getGraphData(dto);
    }
    getTableData(dto) {
        return this.service.getDataForTable(dto.date);
    }
};
exports.StatisticalController = StatisticalController;
__decorate([
    (0, common_1.Post)('calculate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_statistical_dto_1.CalculateStatisticalDto]),
    __metadata("design:returntype", void 0)
], StatisticalController.prototype, "calculate", null);
__decorate([
    (0, common_1.Post)('graph-data'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_statistical_dto_1.GetGraphDataDto]),
    __metadata("design:returntype", void 0)
], StatisticalController.prototype, "getGraphData", null);
__decorate([
    (0, common_1.Post)('table-data'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_statistical_dto_1.GetTableDataDto]),
    __metadata("design:returntype", void 0)
], StatisticalController.prototype, "getTableData", null);
exports.StatisticalController = StatisticalController = __decorate([
    (0, common_1.Controller)('statistical'),
    __metadata("design:paramtypes", [statistical_service_1.StatisticalService])
], StatisticalController);
//# sourceMappingURL=statistical.controller.js.map