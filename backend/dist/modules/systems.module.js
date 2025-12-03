"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemsModule = void 0;
const common_1 = require("@nestjs/common");
const systems_controller_1 = require("../controllers/systems.controller");
const systems_service_1 = require("../services/systems.service");
let SystemsModule = class SystemsModule {
};
exports.SystemsModule = SystemsModule;
exports.SystemsModule = SystemsModule = __decorate([
    (0, common_1.Module)({
        controllers: [systems_controller_1.SystemsController],
        providers: [systems_service_1.SystemsService],
    })
], SystemsModule);
//# sourceMappingURL=systems.module.js.map