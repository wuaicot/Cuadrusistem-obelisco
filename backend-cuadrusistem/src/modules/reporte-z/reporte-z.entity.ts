import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { TurnoTipo } from '../../domain/enums/turno.enum';
import { UserEntity } from '../users/user.entity';
import { LocalEntity } from '../locales/local.entity';

/**
 * Reporte Z
 * Fuente de verdad fiscal / operativa.
 * Representa exactamente lo impreso por el POS.
 */
@Entity({ name: 'reporte_z' })
export class ReporteZEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Turno al que corresponde el reporte
   */
  @Column({
    type: 'enum',
    enum: TurnoTipo,
  })
  turno: TurnoTipo;

  /**
   * Fecha operativa del negocio (NO timestamp del sistema)
   */
  @Column({ type: 'date' })
  fechaOperacion: string;

  /**
   * Local asociado al reporte
   */
  @ManyToOne(() => LocalEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'local_id' })
  local: LocalEntity;

  /**
   * Usuario administrador que cargó el reporte
   */
  @ManyToOne(() => UserEntity, {
    nullable: false,
  })
  @JoinColumn({ name: 'admin_id' })
  cargadoPor: UserEntity;

  /**
   * Ítems normalizados del Reporte Z
   * Derivados directamente del papel / PDF / imagen
   *
   * Ej:
   * {
   *   codigo: "4221",
   *   nombre: "SCHOP QUILMES 500CC",
   *   cantidad: 3,
   *   seccion: "BAR"
   * }
   */
  @Column({ type: 'jsonb' })
  items: {
    codigo: string;
    nombre: string;
    cantidad: number;
    seccion: 'BAR' | 'COCINA' | 'EMPANADAS';
  }[];

  /**
   * Ruta del archivo original (foto o PDF)
   */
  @Column()
  archivoOriginal: string;

  /**
   * Hash único para evitar reportes duplicados
   */
  @Column({ unique: true })
  checksum: string;

  /**
   * Indica si el reporte ya fue analizado por el motor de cuadre
   */
  @Column({ default: false })
  procesado: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
