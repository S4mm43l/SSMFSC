import { Module } from '@nestjs/common';
import { StatisticalController } from '../controllers/statistical.controller';
import { StatisticalService } from '../services/statistical.service';

@Module({
  controllers: [StatisticalController],
  providers: [StatisticalService],
})
export class StatisticalModule {}
