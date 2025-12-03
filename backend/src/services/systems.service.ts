import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../modules/supabase/supabase.service';
import { FsoSystemDto, RfSystemDto } from '../dto/systems.dto';

@Injectable()
export class SystemsService {
  constructor(private readonly supabase: SupabaseService) {}

  async getFsoSystems(): Promise<FsoSystemDto[]> {
 
    return [
      {
        id: 1,
        name: 'MRV TS5000/155',
        txPower: 140,
        txPowerUnit: 'mW',
        rxSensitivity: -36,
        rxLensDiameter: 20,
        directivity: 4,
        wavelength: 850,
        companyName: 'MRV',
      },
      {
        id: 2,
        name: 'FlightStrata 155E',
        txPower: 140,
        txPowerUnit: 'mW',
        rxSensitivity: -32,
        rxLensDiameter: 20,
        directivity: 4,
        wavelength: 850,
        companyName: 'LightPointe',
      },
      {
        id: 3,
        name: 'Canobeam DT-110',
        txPower: 20,
        txPowerUnit: 'mW',
        rxSensitivity: -34,
        rxLensDiameter: 20,
        directivity: 4,
        wavelength: 785,
        companyName: 'Canon',
      },
    ];
  }

  async getRfSystems(): Promise<RfSystemDto[]> {
 
    return [
      {
        id: 1,
        name: 'WTM 6000',
        txPower: 20,
        txPowerUnit: 'dBm',
        rxSensitivity: -71,
        frequency: 6000,
        gain: 0,
        companyName: 'Harris Stratex',
      },
      {
        id: 2,
        name: 'ALCOMA AL80GE',
        txPower: 18,
        txPowerUnit: 'dBm',
        rxSensitivity: -70,
        frequency: 80000,
        gain: 43,
        companyName: 'ALCOMA',
      },
    ];
  }
}
