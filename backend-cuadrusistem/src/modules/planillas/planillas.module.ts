import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanillaEntity } from './planilla.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanillaEntity])],
  exports: [TypeOrmModule],
})
export class PlanillasModule {}
