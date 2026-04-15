import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

type RawMeteoRow = {
  ts: string;
  node: string;
  sensor: string;
  key: string;
  value: number;
  unit: string | null;
  value_text?: string | null;
  source?: string | null;
};

type L1MeteoRow = {
  created_at: string;
  date_key: number;
  node: string;
  temperature_c: number | null;
  humidity_pct: number | null;
  pressure_hpa: number | null;
  rain_mm_h: number | null;
  wind_speed_ms: number | null;
  dust_conc: number | null;
  rssi_dbm: number | null;
};

@Injectable()
export class MeteoEtlService {
  private readonly etlName = 'raw_to_l1_meteo';

  private readonly supabase = createClient(
    process.env.SUPABASE_URL as string,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY) as string,
    {
      db: { schema: 'iot' },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  private toDateKey(isoTs: string): number {
    return Number(isoTs.slice(0, 10).replace(/-/g, ''));
  }

  private normalizeRawValue(row: RawMeteoRow): {
    column: keyof L1MeteoRow | null;
    value: number | null;
  } {
    const key = row.key.toLowerCase();

    switch (key) {
      case 'temperature':
      case 'temperature_c':
      case 'temp':
        return { column: 'temperature_c', value: row.value / 100 };

      case 'humidity':
      case 'humidity_pct':
        return { column: 'humidity_pct', value: row.value / 100 };

      case 'pressure':
      case 'pressure_hpa':
        return { column: 'pressure_hpa', value: row.value };

      case 'rain':
      case 'rain_mm_h':
        return { column: 'rain_mm_h', value: row.value };

      case 'wind_speed':
      case 'wind_speed_ms':
        return { column: 'wind_speed_ms', value: row.value };

      case 'dust':
      case 'dust_conc':
      case 'pm':
      case 'fog':
        return { column: 'dust_conc', value: row.value };

      case 'rssi':
      case 'rssi_dbm':
        return { column: 'rssi_dbm', value: row.value };

      default:
        return { column: null, value: null };
    }
  }

  private makeEmptyRow(ts: string, node: string): L1MeteoRow {
    return {
      created_at: ts,
      date_key: this.toDateKey(ts),
      node,
      temperature_c: null,
      humidity_pct: null,
      pressure_hpa: null,
      rain_mm_h: null,
      wind_speed_ms: null,
      dust_conc: null,
      rssi_dbm: null,
    };
  }

  async run() {
    const { data: stateRow, error: stateError } = await this.supabase
      .from('etl_state')
      .select('last_ts')
      .eq('etl_name', this.etlName)
      .maybeSingle();

    if (stateError) {
      throw new Error(`Failed to read etl_state: ${stateError.message}`);
    }

    const lastTs = stateRow?.last_ts ?? '1970-01-01T00:00:00.000Z';

    const { data: rawRows, error: rawError } = await this.supabase
      .from('raw_meteo')
      .select('*')
      .gt('ts', lastTs)
      .order('ts', { ascending: true });

    if (rawError) {
      throw new Error(`Failed to read raw_meteo: ${rawError.message}`);
    }

    if (!rawRows || rawRows.length === 0) {
      return {
        inserted: 0,
        message: 'No new rows found',
      };
    }

    const grouped = new Map<string, L1MeteoRow>();

    for (const row of rawRows as RawMeteoRow[]) {
      const groupKey = `${row.ts}__${row.node}`;

      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, this.makeEmptyRow(row.ts, row.node));
      }

      const target = grouped.get(groupKey)!;
      const mapped = this.normalizeRawValue(row);

      if (mapped.column) {
        target[mapped.column] = mapped.value as never;
      }
    }

    const payload = Array.from(grouped.values());

    const { error: upsertError } = await this.supabase
      .from('l1_meteo_data')
      .upsert(payload, { onConflict: 'created_at,node' });

    if (upsertError) {
      throw new Error(`Failed to upsert l1_meteo_data: ${upsertError.message}`);
    }

    const newestTs = (rawRows as RawMeteoRow[])[rawRows.length - 1].ts;

    const { error: saveStateError } = await this.supabase
      .from('etl_state')
      .upsert({
        etl_name: this.etlName,
        last_ts: newestTs,
      });

    if (saveStateError) {
      throw new Error(`Failed to update etl_state: ${saveStateError.message}`);
    }

    return {
      inserted: payload.length,
      lastProcessedTs: newestTs,
    };
  }

  async getMeteo(limit = 2000) {
    const { data, error } = await this.supabase
      .from('l1_meteo_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch meteo data: ${error.message}`);
    }

    return data;
  }

  async getMeteoByNode(node: string, limit = 2000) {
    const { data, error } = await this.supabase
      .from('l1_meteo_data')
      .select('*')
      .eq('node', node)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch meteo data for node ${node}: ${error.message}`);
    }

    return data;
  }

async getMeteoByDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);

  const localStart = new Date(year, month - 1, day, 0, 0, 0, 0);
  const localEnd = new Date(year, month - 1, day + 1, 0, 0, 0, 0);

  const startIso = localStart.toISOString();
  const endIso = localEnd.toISOString();

  const pageSize = 1000;
  let from = 0;
  let allRows: any[] = [];

  while (true) {
    const to = from + pageSize - 1;

    const { data, error } = await this.supabase
      .from('l1_meteo_data')
      .select('*')
      .gte('created_at', startIso)
      .lt('created_at', endIso)
      .order('created_at', { ascending: true })
      .range(from, to);

    if (error) {
      throw new Error(`Failed to fetch meteo data by date: ${error.message}`);
    }

    if (!data || data.length === 0) {
      break;
    }

    allRows = allRows.concat(data);

    if (data.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  return allRows;
}
}