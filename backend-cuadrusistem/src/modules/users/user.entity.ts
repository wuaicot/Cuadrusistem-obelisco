import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Rol } from '../../domain/enums/rol.enum';
import { TurnoEntity } from '../turnos/turno.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Rol,
  })
  rol: Rol;

  @ManyToOne(() => TurnoEntity, (turno) => turno.usuarios, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'turno_id' })
  turno: TurnoEntity | null;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
