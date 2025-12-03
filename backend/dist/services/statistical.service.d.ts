import { SupabaseService } from '../modules/supabase/supabase.service';
import { CalculateStatisticalDto, GetGraphDataDto } from '../dto/calculate-statistical.dto';
export declare class StatisticalService {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    calculate(dto: CalculateStatisticalDto): Promise<{
        alfaAtm: number;
        alfaTurb: number;
        alfaGeom: number;
        alfaClearTotal: number;
        linkMargin: number;
        normLinkMargin: number;
        numSecondsUnavailability: number;
        fadeProbability: number;
        linkAvailability: number;
    }>;
    getGraphData(dto: GetGraphDataDto): Promise<{
        [dto.type]: any;
        time: any;
    }[]>;
    getDataForTable(date: string): Promise<any[]>;
}
