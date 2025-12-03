import { SupabaseService } from '../modules/supabase/supabase.service';
export declare class SensorService {
    private readonly supabase;
    private readonly logger;
    private port;
    private isRunning;
    private parser;
    private fogBuffer;
    private tempBuffer;
    private humBuffer;
    constructor(supabase: SupabaseService);
    listPorts(): Promise<import("@serialport/bindings-interface").PortInfo[]>;
    connect(path: string): Promise<void>;
    disconnect(): Promise<void>;
    private handleData;
    private processAndSave;
    private calculateAverage;
}
