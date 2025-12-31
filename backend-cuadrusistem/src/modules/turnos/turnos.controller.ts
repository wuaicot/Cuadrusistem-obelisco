// backend-cuadrusistem/src/modules/turnos/turnos.controller.ts
import { Controller, Get } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { TurnoEntity } from './turno.entity';

@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Get()
  async findAll(): Promise<TurnoEntity[]> {
    return this.turnosService.findAll();
  }
}
