import { Rol } from '../enums/rol.enum';
import { TurnoTipo } from '../enums/turno.enum';

export type Usuario = {
  id: string;
  nombre: string;
  rol: Rol;
  turnoTipo?: TurnoTipo;
};
