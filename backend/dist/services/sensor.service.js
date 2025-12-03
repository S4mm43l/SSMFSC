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
var SensorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorService = void 0;
const common_1 = require("@nestjs/common");
const serialport_1 = require("serialport");
const supabase_service_1 = require("../modules/supabase/supabase.service");
let SensorService = SensorService_1 = class SensorService {
    supabase;
    logger = new common_1.Logger(SensorService_1.name);
    port = null;
    isRunning = false;
    parser;
    fogBuffer = [];
    tempBuffer = [];
    humBuffer = [];
    constructor(supabase) {
        this.supabase = supabase;
    }
    async listPorts() {
        return await serialport_1.SerialPort.list();
    }
    async connect(path) {
        if (this.port && this.port.isOpen) {
            await this.disconnect();
        }
        this.logger.log(`Connecting to sensor on ${path}...`);
        this.port = new serialport_1.SerialPort({ path, baudRate: 38400 });
        this.port.on('open', () => {
            this.logger.log(`Connected to ${path}`);
            this.isRunning = true;
        });
        this.port.on('data', (data) => {
            if (!this.isRunning)
                return;
            this.handleData(data.toString());
        });
        this.port.on('error', (err) => {
            this.logger.error(`Serial Port Error: ${err.message}`);
            this.isRunning = false;
        });
    }
    async disconnect() {
        if (this.port) {
            if (this.port.isOpen) {
                this.port.close();
            }
            this.port = null;
        }
        this.isRunning = false;
        this.logger.log('Disconnected from sensor');
    }
    handleData(rawString) {
        const tokens = rawString.trim().split(/\s+/);
        if (tokens.length < 3)
            return;
        try {
            const values = [];
            for (const token of tokens) {
                if (token.length < 2)
                    continue;
                const val = parseInt(token.substring(1));
                if (!isNaN(val)) {
                    values.push(val);
                }
            }
            if (values.length >= 3) {
                const [fogRaw, tempRaw, humRaw] = values;
                if (fogRaw > 9999 || tempRaw > 9999 || humRaw > 9999)
                    return;
                this.fogBuffer.push(fogRaw);
                this.tempBuffer.push(tempRaw);
                this.humBuffer.push(humRaw);
                if (this.fogBuffer.length >= 10) {
                    this.processAndSave();
                }
            }
        }
        catch (err) {
            this.logger.error(`Error parsing data: ${err.message}`);
        }
    }
    async processAndSave() {
        const avgFog = this.calculateAverage(this.fogBuffer);
        const avgTemp = this.calculateAverage(this.tempBuffer);
        const avgHum = this.calculateAverage(this.humBuffer);
        this.fogBuffer = [];
        this.tempBuffer = [];
        this.humBuffer = [];
        this.logger.log(`Saving Average - Fog: ${avgFog}, Temp: ${avgTemp}, Hum: ${avgHum}`);
        const client = this.supabase.getIotClient();
        const timestamp = new Date().toISOString();
        const rows = [
            {
                ts: timestamp,
                node: 'default',
                sensor: 'fog_sensor',
                key: 'fog',
                value: avgFog,
                unit: 'raw',
            },
            {
                ts: timestamp,
                node: 'default',
                sensor: 'temp_sensor',
                key: 'temperature',
                value: avgTemp,
                unit: 'raw',
            },
            {
                ts: timestamp,
                node: 'default',
                sensor: 'hum_sensor',
                key: 'humidity',
                value: avgHum,
                unit: 'raw',
            },
        ];
        const { error } = await client.from('raw_meteo').insert(rows);
        if (error) {
            this.logger.error(`Failed to save measurement: ${error.message}`);
        }
    }
    calculateAverage(arr) {
        if (arr.length === 0)
            return 0;
        const sum = arr.reduce((a, b) => a + b, 0);
        return Math.round(sum / arr.length);
    }
};
exports.SensorService = SensorService;
exports.SensorService = SensorService = SensorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], SensorService);
//# sourceMappingURL=sensor.service.js.map