import { Body, Controller, Post } from '@nestjs/common';
import { FsoService } from '../services/fso.service';
import { CalculateFsoDto } from '../dto/calculate-fso.dto';

@Controller('fso')
export class FsoController {
  constructor(private readonly fsoService: FsoService) {}

  @Post('calculate')
  calculate(@Body() dto: CalculateFsoDto) {
    return this.fsoService.calculate(dto);
  }
}
