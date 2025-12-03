"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RfModule = void 0;
const common_1 = require("@nestjs/common");
const rf_controller_1 = require("../controllers/rf.controller");
const rf_service_1 = require("../services/rf.service");
const fso_module_1 = require("./fso.module");
const fso_service_1 = require("../services/fso.service");
let RfModule = class RfModule {
};
exports.RfModule = RfModule;
exports.RfModule = RfModule = __decorate([
    (0, common_1.Module)({
        imports: [fso_module_1.FsoModule],
        controllers: [rf_controller_1.RfController],
        providers: [rf_service_1.RfService, fso_service_1.FsoService],
    })
], RfModule);
//# sourceMappingURL=rf.module.js.map