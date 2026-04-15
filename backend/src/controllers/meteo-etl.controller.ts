import { Controller, Post } from '@nestjs/common';
import { MeteoEtlService } from '../services/meteo-etl.service';

@Controller('meteo-etl')
export class MeteoEtlController {
  constructor(private readonly meteoEtlService: MeteoEtlService) {}

  @Post('run')
  async run() {
    return this.meteoEtlService.run();
  }
}