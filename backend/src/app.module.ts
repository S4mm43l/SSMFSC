import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { FsoModule } from './modules/fso.module';
import { RfModule } from './modules/rf.module';
import { StatisticalModule } from './modules/statistical.module';
import { SystemsModule } from './modules/systems.module';
import { SensorService } from './services/sensor.service';
import { SensorController } from './controllers/sensor.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    FsoModule,
    RfModule,
    StatisticalModule,
    SystemsModule,
  ],
  controllers: [AppController, SensorController],
  providers: [AppService, SensorService],
})
export class AppModule {}
