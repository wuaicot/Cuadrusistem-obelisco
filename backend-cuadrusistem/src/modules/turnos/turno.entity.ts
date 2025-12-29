import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TurnoTipo } from '../../domain/enums/turno.enum';
import { UserEntity } from '../users/user.entity';
import { LocalEntity } from '../locales/local.entity';

@Entity('turnos')
export class TurnoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TurnoTipo,
    unique: true,
  })
  tipo: TurnoTipo;

  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'time' })
  horaFin: string;

  /**
   * Usuarios asignados a este turno
   */
  @OneToMany(() => UserEntity, (user) => user.turno)
  usuarios: UserEntity[];

  /**
   * Local al que pertenece el turno
   */
  @ManyToOne(() => LocalEntity, (local) => local.turnos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'local_id' })
  local: LocalEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
