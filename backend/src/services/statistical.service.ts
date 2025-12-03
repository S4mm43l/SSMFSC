import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../modules/supabase/supabase.service';
import {
  CalculateStatisticalDto,
  GetGraphDataDto,
} from '../dto/calculate-statistical.dto';
import { StatisticalMathLogic } from '../logic/statistical-math.logic';
import { FsoMathLogic, EnumCalcMethod } from '../logic/fso-math.logic';
import { CalculateFsoDto } from '../dto/calculate-fso.dto';

@Injectable()
export class StatisticalService {
  constructor(private readonly supabase: SupabaseService) {}

  async calculate(dto: CalculateStatisticalDto) {

    const client = this.supabase.getIotClient();

    console.log('=== Statistical Calculate (IOT Schema) ===');
    console.log('Date Range:', dto.beginDate, 'to', dto.endDate);

 
    const { data, error } = await client
      .from('raw_meteo')
      .select('value')
      .eq('key', 'fog')
      .gte('ts', dto.beginDate)
      .lte('ts', dto.endDate);

    if (error) {
      console.error('Query Error:', error);
      throw new Error(error.message);
    }

    console.log('Data Count:', data?.length || 0);

   
    const fogValues = data.map((d) => d.value);


    const statLogic = new StatisticalMathLogic(dto.maxDensityOfFog);
    const statResult = statLogic.calculate(fogValues);

 
    const fsoDto: CalculateFsoDto = {
        model: dto.model,
        airTurbulence: dto.airTurbulence,
        adtUtlmMethod: dto.adtUtlmMethod,
        vykon: dto.vykon,
        jednotkaVykonu: dto.jednotkaVykonu,
        citlivost: dto.citlivost,
        priemer: dto.priemer,
        smerovost: dto.smerovost,
        vlnovaDlzka: dto.vlnovaDlzka,
        vzdialenost: dto.vzdialenost,
        jednotkaVzdialenosti: dto.jednotkaVzdialenosti,
        viditelnost: dto.viditelnost,
        dazd: dto.dazd,
        suchySneh: dto.suchySneh,
        mokrySneh: dto.mokrySneh,
        aditivnyUtlm: dto.aditivnyUtlm
    };

    const fsoLogic = new FsoMathLogic(fsoDto);
    
    const fsoResult = {
      alfaAtm: fsoLogic.calculateAttenuationParticles(),
      alfaTurb: fsoLogic.calculateAttenuationTurbulence(),
      alfaGeom: fsoLogic.calculateGeometricAttenuation(),
      alfaClearTotal: fsoLogic.calculateClearAtmosphereAttenuation(),
      linkMargin: fsoLogic.calculateLinkMargin(),
      normLinkMargin: fsoLogic.calculateNormalizedLinkMargin(),
    };

    return {
        ...statResult,
        ...fsoResult
    };
  }

  async getGraphData(dto: GetGraphDataDto) {
    const client = this.supabase.getIotClient();

    console.log('=== Graph Data (IOT Schema) ===');
    console.log('Type:', dto.type);


    const dbKey = dto.type;

    const { data, error } = await client
      .from('raw_meteo')
      .select('ts, value')
      .eq('key', dbKey)
      .gte('ts', dto.beginDate)
      .lte('ts', dto.endDate)
      .order('ts', { ascending: true });

    if (error) {
      console.error('Query Error:', error);
      throw new Error(error.message);
    }

    return data.map((d) => ({
      time: d.ts,
      [dto.type]: d.value,
    }));
  }

  async getDataForTable(date: string) {
    const client = this.supabase.getIotClient();
   
    const start = `${date}T00:00:00.000Z`;
    const end = `${date}T23:59:59.999Z`;

    console.log('=== Get Data For Table ===');
    console.log('Date:', date);

    const { data, error } = await client
      .from('raw_meteo')
      .select('ts, key, value')
      .gte('ts', start)
      .lte('ts', end)
      .in('key', ['fog', 'temperature', 'wind_speed', 'humidity']);

    if (error) {
      console.error('Query Error:', error);
      throw new Error(error.message);
    }


    const grouped: Record<string, any> = {};

    data.forEach((row) => {
    
      const timeKey = new Date(row.ts).toISOString(); 
      
      if (!grouped[timeKey]) {
        grouped[timeKey] = { 
          time: new Date(row.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: row.ts 
        };
      }
      
    
      if (row.key === 'fog') grouped[timeKey].visibility = row.value;
      else if (row.key === 'temperature') grouped[timeKey].temp = row.value;
      else if (row.key === 'wind_speed') grouped[timeKey].wind = row.value;
      else if (row.key === 'humidity') grouped[timeKey].humidity = row.value;
    });

    return Object.values(grouped).sort((a: any, b: any) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }
}
