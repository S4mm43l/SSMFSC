import { FsoService } from '../services/fso.service';
import { CalculateFsoDto } from '../dto/calculate-fso.dto';
export declare class FsoController {
    private readonly fsoService;
    constructor(fsoService: FsoService);
    calculate(dto: CalculateFsoDto): any;
}
