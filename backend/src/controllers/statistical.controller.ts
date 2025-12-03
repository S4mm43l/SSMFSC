import { Body, Controller, Post } from '@nestjs/common';
import { StatisticalService } from '../services/statistical.service';
import { CalculateStatisticalDto, GetGraphDataDto, GetTableDataDto } from '../dto/calculate-statistical.dto';

@Controller('statistical')
export class StatisticalController {
  constructor(private readonly service: StatisticalService) {}

  @Post('calculate')
  calculate(@Body() dto: CalculateStatisticalDto) {
    return this.service.calculate(dto);
  }

  @Post('graph-data')
  getGraphData(@Body() dto: GetGraphDataDto) {
    return this.service.getGraphData(dto);
  }

  @Post('table-data')
  getTableData(@Body() dto: GetTableDataDto) {
    return this.service.getDataForTable(dto.date);
  }
}
