import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnoEntity } from './turno.entity';
import { LocalesModule } from '../locales/locales.module';
import { TurnosService } from './turnos.service'; // Import TurnosService
import { TurnosController } from './turnos.controller'; // Import TurnosController

@Module({
  imports: [
    TypeOrmModule.forFeature([TurnoEntity]),
    LocalesModule, // 👈 CLAVE
  ],
  controllers: [TurnosController], // Add TurnosController here
  providers: [TurnosService], // Add TurnosService here
  exports: [TypeOrmModule, TurnosService], // Export TurnosService
})
export class TurnosModule {}
