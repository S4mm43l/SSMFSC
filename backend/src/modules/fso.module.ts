import { Module } from '@nestjs/common';
import { FsoController } from '../controllers/fso.controller';
import { FsoService } from '../services/fso.service';

@Module({
  controllers: [FsoController],
  providers: [FsoService],
})
export class FsoModule {}
