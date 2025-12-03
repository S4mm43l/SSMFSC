import { Module } from '@nestjs/common';
import { RfController } from '../controllers/rf.controller';
import { RfService } from '../services/rf.service';
import { FsoModule } from './fso.module';
import { FsoService } from '../services/fso.service';

@Module({
  imports: [FsoModule],
  controllers: [RfController],
  providers: [RfService, FsoService],
})
export class RfModule {}
