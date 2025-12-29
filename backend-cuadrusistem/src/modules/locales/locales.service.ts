import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalEntity } from './local.entity';

@Injectable()
export class LocalesService {
  constructor(
    @InjectRepository(LocalEntity)
    private readonly localRepository: Repository<LocalEntity>,
  ) {}

  findAll(): Promise<LocalEntity[]> {
    return this.localRepository.find();
  }
}
