import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { PlanillasService } from './planillas.service';
import { CreatePlanillaDto } from './dto/create-planilla.dto';
import { PlanillaEntity } from './planilla.entity';
import { TipoPlanilla } from '../../domain/enums/planilla.enum'; // Import TipoPlanilla

@Controller('planillas')
export class PlanillasController {
  constructor(private readonly planillasService: PlanillasService) {}

  @Post()
  async create(@Body() createPlanillaDto: CreatePlanillaDto) {
    return this.planillasService.create(createPlanillaDto);
  }

  @Get()
  async findAll(
    @Query('tipo') tipo?: TipoPlanilla,
    @Query('localId') localId?: string,
    @Query('turnoId') turnoId?: string,
  ): Promise<PlanillaEntity[]> {
    return this.planillasService.findAll(tipo, localId, turnoId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PlanillaEntity> {
    const planilla = await this.planillasService.findOne(id);
    if (!planilla) {
      throw new NotFoundException(`Planilla with ID ${id} not found.`);
    }
    return planilla;
  }
}

