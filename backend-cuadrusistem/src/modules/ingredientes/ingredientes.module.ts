import { Module } from '@nestjs/common';
import { IngredientesController } from './ingredientes.controller';
import { IngredientesService } from './ingredientes.service';

@Module({
  controllers: [IngredientesController],
  providers: [IngredientesService]
})
export class IngredientesModule {}
