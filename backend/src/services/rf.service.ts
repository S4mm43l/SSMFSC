import { Injectable } from '@nestjs/common';
import { CalculateRfDto } from '../dto/calculate-rf.dto';
import { RfMathLogic } from '../logic/rf-math.logic';
import { FsoService } from './fso.service';
import { serializeSpecialNumbers } from '../utils/serialize-numbers.util';

@Injectable()
export class RfService {
  constructor(private readonly fsoService: FsoService) {}

  calculate(dto: CalculateRfDto) {
    const fsoResult = this.fsoService.calculate(dto);

    const logic = new RfMathLogic(dto, dto);

    const rfResult = {
      si: logic.getSi(),
      fsl: logic.getFSL(),
      weatherAttenuation: logic.getWeatherAttenuation(),
      maxLinkDistance: logic.getMaxLinkDistanceRF(),
      linkStatus: logic.isAvailableRF() ? 'Link OK' : 'Link DOWN',
    };

    return serializeSpecialNumbers({
      fso: fsoResult,
      rf: rfResult,
    });
  }
}
