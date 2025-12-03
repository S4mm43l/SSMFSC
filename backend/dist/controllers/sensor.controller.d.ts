import { SensorService } from '../services/sensor.service';
export declare class SensorController {
    private readonly sensorService;
    constructor(sensorService: SensorService);
    listPorts(): Promise<import("@serialport/bindings-interface").PortInfo[]>;
    connect(path: string): Promise<{
        status: string;
        path: string;
    }>;
    disconnect(): Promise<{
        status: string;
    }>;
}
