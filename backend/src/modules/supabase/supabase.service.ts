import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;
  private iotSupabase: SupabaseClient<any, 'iot'>;

  onModuleInit() {
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey =
      process.env.API_KEY ||
      process.env.SUPABASE_KEY ||
      process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key must be provided in .env');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.iotSupabase = createClient<any, 'iot'>(supabaseUrl, supabaseKey, {
      db: { schema: 'iot' },
    });
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  getIotClient(): SupabaseClient<any, 'iot'> {
    return this.iotSupabase;
  }
}
