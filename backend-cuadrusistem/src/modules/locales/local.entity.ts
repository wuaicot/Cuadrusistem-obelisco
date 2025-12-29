import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TurnoEntity } from '../turnos/turno.entity';
import { CuadreEntity } from '../cuadre/cuadre.entity';

@Entity({ name: 'locales' })
export class LocalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120, unique: true })
  nombre: string;

  @Column({ default: true })
  activo: boolean;

  /**
   * Turnos configurados para el local
   */
  @OneToMany(() => TurnoEntity, (turno) => turno.local)
  turnos: TurnoEntity[];

  /**
   * Historial de cuadres del local
   */
  @OneToMany(() => CuadreEntity, (cuadre) => cuadre.local)
  cuadres: CuadreEntity[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
