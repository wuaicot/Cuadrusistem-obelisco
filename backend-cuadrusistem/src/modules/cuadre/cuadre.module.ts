// src/modules/cuadre/cuadre.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CuadreEntity } from './cuadre.entity';
import { CuadrarTurnoService } from './cuadrar-turno.service';

import { ReporteZEntity } from '../reporte-z/reporte-z.entity';
import { PlanillaEntity } from '../planillas/planilla.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CuadreEntity, ReporteZEntity, PlanillaEntity]),
  ],
  providers: [CuadrarTurnoService],
  exports: [CuadrarTurnoService],
})
export class CuadreModule {}
