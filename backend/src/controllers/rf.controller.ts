import { Body, Controller, Post } from '@nestjs/common';
import { RfService } from '../services/rf.service';
import { CalculateRfDto } from '../dto/calculate-rf.dto';

@Controller('rf')
export class RfController {
  constructor(private readonly rfService: RfService) {}

  @Post('calculate')
  calculate(@Body() dto: CalculateRfDto) {
    return this.rfService.calculate(dto);
  }
}
