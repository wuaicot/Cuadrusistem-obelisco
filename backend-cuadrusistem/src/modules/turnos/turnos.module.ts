import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnoEntity } from './turno.entity';
import { LocalesModule } from '../locales/locales.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TurnoEntity]),
    LocalesModule, // 👈 CLAVE
  ],
  exports: [TypeOrmModule],
})
export class TurnosModule {}
