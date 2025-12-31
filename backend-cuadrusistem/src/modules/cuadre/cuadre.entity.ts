import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { CuadreEstado } from '../../domain/enums/cuadre-estado.enum';

import { LocalEntity } from '../locales/local.entity';
import { ReporteZEntity } from '../reporte-z/reporte-z.entity';
import { PlanillaEntity } from '../planillas/planilla.entity';
import { TurnoEntity } from '../turnos/turno.entity'; // Import TurnoEntity

@Entity({ name: 'cuadres' })
export class CuadreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Fecha operativa del turno
   */
  @Column({ type: 'date' })
  fechaOperacion: string;

  /**
   * Turno evaluado
   */
  @ManyToOne(() => TurnoEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'turno_id' }) // Specify the foreign key column name
  turno: TurnoEntity; // Change type to TurnoEntity

  /**
   * Local
   */
  @ManyToOne(() => LocalEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'local_id' })
  local: LocalEntity;

  /**
   * Reporte Z asociado
   */
  @OneToOne(() => ReporteZEntity, {
    nullable: false,
  })
  @JoinColumn({ name: 'reporte_z_id' })
  reporteZ: ReporteZEntity;

  /**
   * Planilla Cocina
   */
  @OneToOne(() => PlanillaEntity, {
    nullable: false,
  })
  @JoinColumn({ name: 'planilla_cocina_id' })
  planillaCocina: PlanillaEntity;

  /**
   * Planilla Caja
   */
  @OneToOne(() => PlanillaEntity, {
    nullable: false,
  })
  @JoinColumn({ name: 'planilla_caja_id' })
  planillaCaja: PlanillaEntity;

  /**
   * Estado final del cuadre
   * Derivado del cálculo de diferencias
   */
  @Column({
    type: 'enum',
    enum: CuadreEstado,
  })
  estado: CuadreEstado;

  /**
   * Detalle del cuadre por ingrediente
   *
   * Ej:
   * {
   *   "Vienesa personal": {
   *     "teorico": 12,
   *     "real": 11,
   *     "diferencia": -1
   *   }
   * }
   */
  @Column({ type: 'jsonb' })
  detalle: Record<
    string,
    {
      teorico: number;
      real: number;
      diferencia: number;
    }
  >;

  /**
   * Indica si el cuadre fue recalculado
   */
  @Column({ default: false })
  recalculado: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
