import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReporteZEntity } from './reporte-z.entity';
import { ReporteZController } from './reporte-z.controller';
import { ReporteZService } from './reporte-z.service';
import { LocalEntity } from '../locales/local.entity';
import { OcrService } from './ocr.service'; // Import OcrService
import { TurnosModule } from '../turnos/turnos.module'; // Import TurnosModule

@Module({
  imports: [
    TypeOrmModule.forFeature([ReporteZEntity, LocalEntity]),
    TurnosModule, // Add TurnosModule here
  ],
  controllers: [ReporteZController],
  providers: [ReporteZService, OcrService], // Add OcrService here
  exports: [TypeOrmModule],
})
export class ReporteZModule {}
