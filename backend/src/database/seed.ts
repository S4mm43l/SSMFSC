import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.API_KEY || process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

console.log('=== Database Seeding Script ===');
console.log('Supabase URL:', supabaseUrl ? 'Found' : 'MISSING');
console.log('Supabase Key:', supabaseKey ? 'Found (length: ' + supabaseKey.length + ')' : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Missing Supabase credentials in .env');
  console.error('Please ensure SUPABASE_URL and API_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'iot' },
});

async function seed() {
  try {
    console.log('\n📊 Generating 1000 measurement records (3000 rows)...');

    const measurements: any[] = [];
    const startDate = new Date('2015-01-01T00:00:00Z');
    const endDate = new Date('2023-12-31T23:59:59Z');

    for (let i = 0; i < 1000; i++) {
      const time = new Date(
        startDate.getTime() +
          Math.random() * (endDate.getTime() - startDate.getTime()),
      );

      const dayOfYear = getDayOfYear(time);
      const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI);

      const baseTempC = 10 + seasonalFactor * 20;
      const tempVariation = (Math.random() - 0.5) * 10;
      const tempC = baseTempC + tempVariation;
      const tempRaw = Math.floor((tempC + 40) / 0.01);

      const baseHumidity = 50 - seasonalFactor * 20;
      const humVariation = (Math.random() - 0.5) * 30;
      const humidity = Math.max(10, Math.min(90, baseHumidity + humVariation));

      const humRaw = Math.floor(humidity * 100);

      const fogSeasonFactor = Math.abs(
        Math.cos((dayOfYear / 365) * 2 * Math.PI),
      ); 
      const baseFog = fogSeasonFactor * 600;
      const fogVariation = Math.random() * 400;
      const fog = Math.floor(baseFog + fogVariation);

      const ts = time.toISOString();

      measurements.push(
        {
          ts,
          node: 'seed_node',
          sensor: 'fog_sensor',
          key: 'fog',
          value: fog,
          unit: 'raw',
        },
        {
          ts,
          node: 'seed_node',
          sensor: 'temp_sensor',
          key: 'temperature',
          value: tempRaw,
          unit: 'raw',
        },
        {
          ts,
          node: 'seed_node',
          sensor: 'hum_sensor',
          key: 'humidity',
          value: humRaw,
          unit: 'raw',
        },
      );
    }

    function getDayOfYear(date: Date): number {
      const start = new Date(date.getFullYear(), 0, 0);
      const diff = date.getTime() - start.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      return Math.floor(diff / oneDay);
    }

    console.log('✅ Generated', measurements.length, 'records');
    console.log('📤 Inserting into database (iot.raw_meteo)...');

    const { data, error } = await supabase
      .from('raw_meteo')
      .insert(measurements);

    if (error) {
      console.error('❌ ERROR inserting data:', error.message);
      console.error('Error details:', JSON.stringify(error, null, 2));
      process.exit(1);
    } else {
      console.log('✅ Successfully inserted measurements!');
      console.log('\n🔍 Verifying insertion...');

      const { data: countData, error: countError } = await supabase
        .from('raw_meteo')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('❌ Error verifying:', countError.message);
      } else {
        console.log('✅ Total records in table:', countData);
      }
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

seed().then(() => {
  console.log('\n✅ Seeding complete!');
  process.exit(0);
}).catch(err => {
  console.error('\n❌ Seeding failed:', err);
  process.exit(1);
});
