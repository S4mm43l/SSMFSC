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
exports.SensorController = void 0;
const common_1 = require("@nestjs/common");
const sensor_service_1 = require("../services/sensor.service");
let SensorController = class SensorController {
    sensorService;
    constructor(sensorService) {
        this.sensorService = sensorService;
    }
    async listPorts() {
        return await this.sensorService.listPorts();
    }
    async connect(path) {
        await this.sensorService.connect(path);
        return { status: 'Connected', path };
    }
    async disconnect() {
        await this.sensorService.disconnect();
        return { status: 'Disconnected' };
    }
};
exports.SensorController = SensorController;
__decorate([
    (0, common_1.Get)('ports'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SensorController.prototype, "listPorts", null);
__decorate([
    (0, common_1.Post)('connect'),
    __param(0, (0, common_1.Body)('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SensorController.prototype, "connect", null);
__decorate([
    (0, common_1.Post)('disconnect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SensorController.prototype, "disconnect", null);
exports.SensorController = SensorController = __decorate([
    (0, common_1.Controller)('sensor'),
    __metadata("design:paramtypes", [sensor_service_1.SensorService])
], SensorController);
//# sourceMappingURL=sensor.controller.js.map