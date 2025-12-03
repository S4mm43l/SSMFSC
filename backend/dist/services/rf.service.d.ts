import { CalculateRfDto } from '../dto/calculate-rf.dto';
import { FsoService } from './fso.service';
export declare class RfService {
    private readonly fsoService;
    constructor(fsoService: FsoService);
    calculate(dto: CalculateRfDto): any;
}
