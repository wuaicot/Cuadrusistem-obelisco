import { Injectable } from '@nestjs/common';
import { INGREDIENTES_MASTER } from '../../domain/ingrediente/ingredientes.master';
import { IngredienteDef } from '../../domain/ingrediente/ingrediente.type';

@Injectable()
export class IngredientesService {
  findAll(): IngredienteDef[] {
    return Object.values(INGREDIENTES_MASTER);
  }
}

