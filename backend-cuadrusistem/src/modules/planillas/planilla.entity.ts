import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TipoPlanilla } from '../../domain/enums/planilla.enum';
import { LocalEntity } from '../locales/local.entity';
import { TurnoEntity } from '../turnos/turno.entity';
import { UserEntity } from '../users/user.entity';

@Entity({ name: 'planillas' })
export class PlanillaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TipoPlanilla,
  })
  tipo: TipoPlanilla;

  @Column({ type: 'date' })
  fecha: Date;

  /**
   * Local al que pertenece la operación
   */
  @ManyToOne(() => LocalEntity, { nullable: false })
  local: LocalEntity;

  /**
   * Turno operativo
   */
  @ManyToOne(() => TurnoEntity, { nullable: false })
  turno: TurnoEntity;

  /**
   * Usuario responsable
   */
  @ManyToOne(() => UserEntity, { nullable: true })
  usuario: UserEntity;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  items: { ingrediente: string; cantidad: number }[];

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  totalDeclarado: number;

  @Column({ default: false })
  cerrada: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
