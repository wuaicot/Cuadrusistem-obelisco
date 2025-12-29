export class Ingrediente {
  readonly nombre: string;
  readonly unidad: string;

  constructor(params: { nombre: string; unidad?: string }) {
    if (!params.nombre || params.nombre.trim() === '') {
      throw new Error('Ingrediente debe tener un nombre válido');
    }

    this.nombre = params.nombre.trim();
    this.unidad = params.unidad ?? 'un';
  }
}
