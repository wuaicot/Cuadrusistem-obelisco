import { Controller, Post, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { CuadrarTurnoService } from './cuadrar-turno.service';
import { ProcessCuadreDto } from './dto/process-cuadre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReporteZEntity } from '../reporte-z/reporte-z.entity';
import { PlanillaEntity } from '../planillas/planilla.entity';
import { TipoPlanilla } from '../../domain/enums/planilla.enum';

@Controller('cuadre')
export class CuadreController {
  constructor(
    private readonly cuadrarTurnoService: CuadrarTurnoService,
    @InjectRepository(ReporteZEntity)
    private readonly reporteZRepo: Repository<ReporteZEntity>,
    @InjectRepository(PlanillaEntity)
    private readonly planillaRepo: Repository<PlanillaEntity>,
  ) {}

  @Post('process')
  async processCuadre(@Body() processCuadreDto: ProcessCuadreDto) {
    const { reporteZId, planillaCocinaId, planillaCajaId } = processCuadreDto;

    const reporteZ = await this.reporteZRepo.findOne({
      where: { id: reporteZId },
      relations: ['local', 'turno'], // Ensure related entities are loaded
    });
    if (!reporteZ) {
      throw new NotFoundException(`ReporteZ with ID ${reporteZId} not found.`);
    }

    const planillaCocina = await this.planillaRepo.findOne({
      where: { id: planillaCocinaId, tipo: TipoPlanilla.COCINA },
      relations: ['local', 'turno'],
    });
    if (!planillaCocina) {
      throw new NotFoundException(`Planilla Cocina with ID ${planillaCocinaId} not found.`);
    }

    const planillaCaja = await this.planillaRepo.findOne({
      where: { id: planillaCajaId, tipo: TipoPlanilla.CAJA },
      relations: ['local', 'turno'],
    });
    if (!planillaCaja) {
      throw new NotFoundException(`Planilla Caja with ID ${planillaCajaId} not found.`);
    }

    // Basic consistency check (can be expanded)
    if (
      reporteZ.local.id !== planillaCocina.local.id ||
      reporteZ.local.id !== planillaCaja.local.id
    ) {
      throw new BadRequestException('Local mismatch between Reporte Z and Planillas.');
    }
    if (
      reporteZ.turno.id !== planillaCocina.turno.id ||
      reporteZ.turno.id !== planillaCaja.turno.id
    ) {
      throw new BadRequestException('Turno mismatch between Reporte Z and Planillas.');
    }


    return this.cuadrarTurnoService.ejecutar({
      reporteZ,
      planillaCocina,
      planillaCaja,
    });
  }
}
