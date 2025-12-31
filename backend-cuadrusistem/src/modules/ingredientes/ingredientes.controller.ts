import { Controller, Get } from '@nestjs/common';
import { IngredientesService } from './ingredientes.service';

@Controller('ingredientes')
export class IngredientesController {
  constructor(private readonly ingredientesService: IngredientesService) {}

  @Get()
  findAll() {
    return this.ingredientesService.findAll();
  }
}

