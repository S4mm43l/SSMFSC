import { Module } from '@nestjs/common';
import { SystemsController } from '../controllers/systems.controller';
import { SystemsService } from '../services/systems.service';

@Module({
  controllers: [SystemsController],
  providers: [SystemsService],
})
export class SystemsModule {}
