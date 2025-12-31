import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../../modules/users/users.module';
import { TurnosModule } from '../../modules/turnos/turnos.module';
import { LocalesModule } from '../../modules/locales/locales.module';
import { CuadreModule } from '../../modules/cuadre/cuadre.module';
import { ReporteZModule } from '../../modules/reporte-z/reporte-z.module';
import { IngredientesModule } from '../../modules/ingredientes/ingredientes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    UsersModule,
    TurnosModule,
    LocalesModule,
    CuadreModule,
    ReporteZModule,
    IngredientesModule,
  ],
})
export class AppModule {}
