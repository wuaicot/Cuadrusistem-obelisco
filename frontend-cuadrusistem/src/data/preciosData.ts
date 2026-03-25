// frontend-cuadrusistem/src/data/preciosData.ts

export interface ProductoProveedor {
  id: string;
  nombre: string;
  presentacion: string; // ej: "CJA/12 LT CAJA"
  unidadesPorEnvase: number; // ej: 12
  precioNetoUnidad: number; // ej: 961.12
  ivaPorcentaje: number; // ej: 19
  categoria: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  categorias: string[];
  productos: ProductoProveedor[];
}

export const CATEGORIAS_COCINA = [
  { id: 'lacteos', nombre: 'Lácteos', icon: '🥛', color: 'bg-blue-100 text-blue-600' },
  { id: 'carnes', nombre: 'Carnes', icon: '🥩', color: 'bg-red-100 text-red-600' },
  { id: 'verduras', nombre: 'Verduras', icon: '🥬', color: 'bg-green-100 text-green-600' },
  { id: 'abarrotes', nombre: 'Abarrotes', icon: '🥫', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'embutidos', nombre: 'Embutidos', icon: '🌭', color: 'bg-orange-100 text-orange-600' },
  { id: 'panaderia', nombre: 'Panadería', icon: '🥖', color: 'bg-amber-100 text-amber-600' },
  { id: 'bebestibles', nombre: 'Bebestibles', icon: '🥤', color: 'bg-purple-100 text-purple-600' },
  { id: 'otros', nombre: 'Otros', icon: '📦', color: 'bg-gray-100 text-gray-600' },
];

export const PROVEEDORES: Proveedor[] = [
  {
    id: 'sanjorge',
    nombre: 'San Jorge',
    categorias: ['lacteos'],
    productos: [
      {
        id: 'leche-entera-colun',
        nombre: 'LECHE ENTERA COLUN',
        presentacion: 'CJA/12 LT CAJA',
        unidadesPorEnvase: 12,
        precioNetoUnidad: 961.12,
        ivaPorcentaje: 19,
        categoria: 'lacteos'
      },
      {
        id: 'crema-leche-colun',
        nombre: 'CREMA DE LECHE',
        presentacion: 'Bolsa 1 LT',
        unidadesPorEnvase: 1,
        precioNetoUnidad: 3500,
        ivaPorcentaje: 19,
        categoria: 'lacteos'
      }
    ]
  },
  {
    id: 'soprole',
    nombre: 'SOPROLE',
    categorias: ['lacteos'],
    productos: [
      {
        id: 'leche-entera-soprole',
        nombre: 'LECHE ENTERA SOPROLE',
        presentacion: 'CJA/12 LT CAJA',
        unidadesPorEnvase: 12,
        precioNetoUnidad: 980.50,
        ivaPorcentaje: 19,
        categoria: 'lacteos'
      }
    ]
  },
  {
    id: 'agropur',
    nombre: 'AGROPUR',
    categorias: ['carnes', 'embutidos'],
    productos: [
      {
        id: 'vienesas-personal',
        nombre: 'Vienesas Personal',
        presentacion: 'Paquete 20 unidades',
        unidadesPorEnvase: 20,
        precioNetoUnidad: 150.25,
        ivaPorcentaje: 19,
        categoria: 'embutidos'
      }
    ]
  }
];
