import { Injectable } from '@nestjs/common';
import { CalculateFsoDto } from '../dto/calculate-fso.dto';
import { FsoMathLogic, EnumCalcMethod } from '../logic/fso-math.logic';
import { serializeSpecialNumbers } from '../utils/serialize-numbers.util';

@Injectable()
export class FsoService {
  calculate(dto: CalculateFsoDto) {
    const logic = new FsoMathLogic(dto);

    const result = {
      alfaAtm: logic.calculateAttenuationParticles(),
      alfaTurb: logic.calculateAttenuationTurbulence(),
      alfaGeom: logic.calculateGeometricAttenuation(),
      alfaClearTotal: logic.calculateClearAtmosphereAttenuation(),
      
      alfaAtmAddNorm: 0,
      alfaRainNorm: 0,
      alfaSnowDryNorm: 0,
      alfaSnowWetNorm: 0,
      
      alfaAddTotalNorm: logic.calculateAtmosphericConditionsAttenuation(),
      
      linkMargin: logic.calculateLinkMargin(),
      normLinkMargin: logic.calculateNormalizedLinkMargin(),
      linkStatus: logic.isLinkAvailable() ? 'Link OK' : 'Link DOWN',
      maxLinkDistance: logic.calculateMaxLinkDistance(),
    };

    if (dto.adtUtlmMethod === EnumCalcMethod.weatherCondition) {
      result.alfaAtmAddNorm = logic.calculateScatteringAttenuation();
      result.alfaRainNorm = logic.calculateRainAttenuation();
      result.alfaSnowDryNorm = logic.calculateDrySnowAttenuation();
      result.alfaSnowWetNorm = logic.calculateWetSnowAttenuation();
    }

    return serializeSpecialNumbers(result);
  }
}
