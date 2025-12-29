import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReporteZEntity } from './reporte-z.entity';
import { ReporteZController } from './reporte-z.controller';
import { ReporteZService } from './reporte-z.service';
import { LocalEntity } from '../locales/local.entity'; // Import LocalEntity

@Module({
  imports: [TypeOrmModule.forFeature([ReporteZEntity, LocalEntity])], // Add LocalEntity to forFeature
  controllers: [ReporteZController],
  providers: [ReporteZService],
  exports: [TypeOrmModule],
})
export class ReporteZModule {}
