import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanillaEntity } from './planilla.entity';
import { CreatePlanillaDto } from './dto/create-planilla.dto';
import { LocalEntity } from '../locales/local.entity';
import { TurnoEntity } from '../turnos/turno.entity';
import { TipoPlanilla } from '../../domain/enums/planilla.enum'; // Import TipoPlanilla

@Injectable()
export class PlanillasService {
  constructor(
    @InjectRepository(PlanillaEntity)
    private readonly planillaRepo: Repository<PlanillaEntity>,
    @InjectRepository(LocalEntity)
    private readonly localRepo: Repository<LocalEntity>,
    @InjectRepository(TurnoEntity)
    private readonly turnoRepo: Repository<TurnoEntity>,
  ) {}

  async create(createPlanillaDto: CreatePlanillaDto): Promise<PlanillaEntity> {
    const { fecha, tipo, turnoId, localId, items } = createPlanillaDto;

    const local = await this.localRepo.findOne({ where: { id: localId } });
    if (!local) {
      throw new BadRequestException(`Local con ID ${localId} no encontrado.`);
    }

    const turno = await this.turnoRepo.findOne({ where: { id: turnoId } });
    if (!turno) {
      throw new BadRequestException(`Turno con ID ${turnoId} no encontrado.`);
    }

    const newPlanilla = this.planillaRepo.create({
      fecha: new Date(fecha),
      tipo,
      local,
      turno,
      items,
      usuario: undefined, // Temporalmente undefined hasta que se implemente la autenticación
      totalDeclarado: 0, // Se calculará o establecerá después
      cerrada: false,
    });

    return this.planillaRepo.save(newPlanilla);
  }

  async findAll(
    tipo?: TipoPlanilla,
    localId?: string,
    turnoId?: string,
  ): Promise<PlanillaEntity[]> {
    const findOptions: any = {
      relations: ['local', 'turno'], // Include related entities
      where: {},
    };

    if (tipo) {
      findOptions.where.tipo = tipo;
    }
    if (localId) {
      findOptions.where.local = { id: localId };
    }
    if (turnoId) {
      findOptions.where.turno = { id: turnoId };
    }

    return this.planillaRepo.find(findOptions);
  }

  async findOne(id: string): Promise<PlanillaEntity | null> {
    return this.planillaRepo.findOne({
      where: { id },
      relations: ['local', 'turno'],
    });
  }
}

