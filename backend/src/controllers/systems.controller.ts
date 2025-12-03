import { Controller, Get } from '@nestjs/common';
import { SystemsService } from '../services/systems.service';

@Controller('systems')
export class SystemsController {
  constructor(private readonly service: SystemsService) {}

  @Get('fso')
  getFsoSystems() {
    return this.service.getFsoSystems();
  }

  @Get('rf')
  getRfSystems() {
    return this.service.getRfSystems();
  }
}
