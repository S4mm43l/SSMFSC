import { CalculateFsoDto } from './calculate-fso.dto';

export class CalculateRfDto extends CalculateFsoDto {
  txPowerRF: number;
  unitTxPowerRF: number;
  rxSensitivityRF: number;
  frequencyRF: number;
  gainRF: number;
}
