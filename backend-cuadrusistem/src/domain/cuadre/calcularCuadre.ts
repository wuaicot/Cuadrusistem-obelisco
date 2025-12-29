// src/domain/cuadre/calcularCuadre.ts

export enum EstadoIngrediente {
  OK = 'OK',
  FALTANTE = 'FALTANTE',
  SOBRANTE = 'SOBRANTE',
}

export type ResultadoIngredienteCuadre = {
  ingrediente: string;
  teorico: number;
  real: number;
  diferencia: number;
  estado: EstadoIngrediente;
};

export type ResultadoCuadre = {
  items: ResultadoIngredienteCuadre[];
  ok: boolean;
};

export type Consumo = Map<string, number>;

export function calcularCuadre(
  consumoTeorico: Consumo,
  consumoReal: Consumo,
): ResultadoCuadre {
  const ingredientes = new Set<string>([
    ...consumoTeorico.keys(),
    ...consumoReal.keys(),
  ]);

  const resultados: ResultadoIngredienteCuadre[] = [];

  let cuadreOk = true;

  for (const ingrediente of ingredientes) {
    const teorico = consumoTeorico.get(ingrediente) ?? 0;
    const real = consumoReal.get(ingrediente) ?? 0;
    const diferencia = real - teorico;

    let estado: EstadoIngrediente = EstadoIngrediente.OK;

    if (diferencia < 0) {
      estado = EstadoIngrediente.FALTANTE;
      cuadreOk = false;
    } else if (diferencia > 0) {
      estado = EstadoIngrediente.SOBRANTE;
      cuadreOk = false;
    }

    resultados.push({
      ingrediente,
      teorico,
      real,
      diferencia,
      estado,
    });
  }

  return {
    items: resultados,
    ok: cuadreOk,
  };
}
