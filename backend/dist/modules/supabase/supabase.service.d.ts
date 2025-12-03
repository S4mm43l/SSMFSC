import { OnModuleInit } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService implements OnModuleInit {
    private supabase;
    private iotSupabase;
    onModuleInit(): void;
    getClient(): SupabaseClient;
    getIotClient(): SupabaseClient<any, 'iot'>;
}
