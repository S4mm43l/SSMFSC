import { SystemsService } from '../services/systems.service';
export declare class SystemsController {
    private readonly service;
    constructor(service: SystemsService);
    getFsoSystems(): Promise<import("../dto/systems.dto").FsoSystemDto[]>;
    getRfSystems(): Promise<import("../dto/systems.dto").RfSystemDto[]>;
}
