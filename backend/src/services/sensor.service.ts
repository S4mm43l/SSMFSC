import { Injectable, Logger } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { SupabaseService } from '../modules/supabase/supabase.service';

@Injectable()
export class SensorService {
  private readonly logger = new Logger(SensorService.name);
  private port: SerialPort | null = null;
  private isRunning = false;
  private parser: any;

  private fogBuffer: number[] = [];
  private tempBuffer: number[] = [];
  private humBuffer: number[] = [];

  constructor(private readonly supabase: SupabaseService) {}

  async listPorts() {
    return await SerialPort.list();
  }

  async connect(path: string) {
    if (this.port && this.port.isOpen) {
      await this.disconnect();
    }

    this.logger.log(`Connecting to sensor on ${path}...`);

    this.port = new SerialPort({ path, baudRate: 38400 });

    this.port.on('open', () => {
      this.logger.log(`Connected to ${path}`);
      this.isRunning = true;
    });

    this.port.on('data', (data: Buffer) => {
      if (!this.isRunning) return;
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

  private handleData(rawString: string) {
    const tokens = rawString.trim().split(/\s+/);
    if (tokens.length < 3) return;

    try {
      const values: number[] = [];
      for (const token of tokens) {
        if (token.length < 2) continue;
        const val = parseInt(token.substring(1));
        if (!isNaN(val)) {
          values.push(val);
        }
      }

      if (values.length >= 3) {
        const [fogRaw, tempRaw, humRaw] = values;

        if (fogRaw > 9999 || tempRaw > 9999 || humRaw > 9999) return;

        this.fogBuffer.push(fogRaw);
        this.tempBuffer.push(tempRaw);
        this.humBuffer.push(humRaw);

        if (this.fogBuffer.length >= 10) {
          this.processAndSave();
        }
      }
    } catch (err) {
      this.logger.error(`Error parsing data: ${err.message}`);
    }
  }

  private async processAndSave() {
    const avgFog = this.calculateAverage(this.fogBuffer);
    const avgTemp = this.calculateAverage(this.tempBuffer);
    const avgHum = this.calculateAverage(this.humBuffer);

    this.fogBuffer = [];
    this.tempBuffer = [];
    this.humBuffer = [];

    this.logger.log(
      `Saving Average - Fog: ${avgFog}, Temp: ${avgTemp}, Hum: ${avgHum}`,
    );

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

  private calculateAverage(arr: number[]): number {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((a, b) => a + b, 0);
    return Math.round(sum / arr.length);
  }
}
