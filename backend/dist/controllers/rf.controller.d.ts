import { RfService } from '../services/rf.service';
import { CalculateRfDto } from '../dto/calculate-rf.dto';
export declare class RfController {
    private readonly rfService;
    constructor(rfService: RfService);
    calculate(dto: CalculateRfDto): any;
}
