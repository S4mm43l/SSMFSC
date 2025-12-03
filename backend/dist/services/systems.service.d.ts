import { SupabaseService } from '../modules/supabase/supabase.service';
import { FsoSystemDto, RfSystemDto } from '../dto/systems.dto';
export declare class SystemsService {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    getFsoSystems(): Promise<FsoSystemDto[]>;
    getRfSystems(): Promise<RfSystemDto[]>;
}
