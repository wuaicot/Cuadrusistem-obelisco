import { Controller, Get } from '@nestjs/common';
import { LocalesService } from './locales.service';
import { LocalEntity } from './local.entity';

@Controller('locales')
export class LocalesController {
  constructor(private readonly localesService: LocalesService) {}

  @Get()
  findAll(): Promise<LocalEntity[]> {
    return this.localesService.findAll();
  }
}
