import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;
  private readonly iotSupabase: SupabaseClient<any, 'iot'>;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase credentials are required: SUPABASE_URL and SUPABASE_KEY',
      );
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
