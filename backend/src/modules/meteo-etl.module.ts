import { Module } from '@nestjs/common';
import { MeteoEtlController } from '../controllers/meteo-etl.controller';
import { MeteoEtlService } from '../services/meteo-etl.service';

@Module({
  controllers: [MeteoEtlController],
  providers: [MeteoEtlService],
  exports: [MeteoEtlService],
})
export class MeteoEtlModule {}