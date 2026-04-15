import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { SensorService } from '../services/sensor.service';
import { MeteoEtlService } from '../services/meteo-etl.service';

@Controller('sensor')
export class SensorController {
  constructor(
    private readonly sensorService: SensorService,
    private readonly meteoEtlService: MeteoEtlService,
  ) {}

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

  @Post('meteo-etl/run')
  async runMeteoEtl() {
    return await this.meteoEtlService.run();
  }

  @Get('meteo')
  async getMeteo(@Query('limit') limit = '100') {
    const parsedLimit = Number(limit) || 100;
    return await this.meteoEtlService.getMeteo(parsedLimit);
  }

  @Get('meteo/by-date')
  async getMeteoByDate(@Query('date') date: string) {
    return await this.meteoEtlService.getMeteoByDate(date);
  }

  @Get('meteo/:node')
  async getMeteoByNode(
    @Param('node') node: string,
    @Query('limit') limit = '100',
  ) {
    const parsedLimit = Number(limit) || 100;
    return await this.meteoEtlService.getMeteoByNode(node, parsedLimit);
  }
}