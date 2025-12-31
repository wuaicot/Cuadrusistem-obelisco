import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanillaEntity } from './planilla.entity';
import { PlanillasController } from './planillas.controller';
import { PlanillasService } from './planillas.service';
import { LocalEntity } from '../locales/local.entity';
import { TurnoEntity } from '../turnos/turno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanillaEntity, LocalEntity, TurnoEntity])],
  exports: [TypeOrmModule],
  controllers: [PlanillasController],
  providers: [PlanillasService],
})
export class PlanillasModule {}
