export type ResultadoCuadre = {
  nombre: string;
  consumoZ: number;
  consumoEsperado: number;
  diferencia: number;
  estado: 'OK' | 'FALTANTE' | 'SOBRANTE';
};
