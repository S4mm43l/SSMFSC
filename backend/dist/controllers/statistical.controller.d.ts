import { StatisticalService } from '../services/statistical.service';
import { CalculateStatisticalDto, GetGraphDataDto, GetTableDataDto } from '../dto/calculate-statistical.dto';
export declare class StatisticalController {
    private readonly service;
    constructor(service: StatisticalService);
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
    getTableData(dto: GetTableDataDto): Promise<any[]>;
}
