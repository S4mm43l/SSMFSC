import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SensorService } from '../services/sensor.service';

@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get('ports')
  async listPorts() {
    return await this.sensorService.listPorts();
  }

  @Post('connect')
  async connect(@Body('path') path: string) {
    await this.sensorService.connect(path);
    return { status: 'Connected', path };
  }

  @Post('disconnect')
  async disconnect() {
    await this.sensorService.disconnect();
    return { status: 'Disconnected' };
  }
}
