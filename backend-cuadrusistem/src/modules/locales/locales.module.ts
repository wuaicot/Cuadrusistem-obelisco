import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalEntity } from './local.entity';
import { LocalesController } from './locales.controller';
import { LocalesService } from './locales.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocalEntity])],
  controllers: [LocalesController],
  providers: [LocalesService],
  exports: [TypeOrmModule],
})
export class LocalesModule {}
