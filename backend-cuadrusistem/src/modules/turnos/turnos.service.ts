// backend-cuadrusistem/src/modules/turnos/turnos.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TurnoEntity } from './turno.entity';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(TurnoEntity)
    private readonly turnoRepository: Repository<TurnoEntity>,
  ) {}

  async findAll(): Promise<TurnoEntity[]> {
    return this.turnoRepository.find();
  }

  async findOne(id: string): Promise<TurnoEntity | null> {
    return this.turnoRepository.findOne({ where: { id } });
  }
}
