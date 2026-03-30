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
  { id: 'mariscos', nombre: 'Mariscos', icon: '🦞', color: 'bg-cyan-100 text-cyan-600' },
  { id: 'aseo', nombre: 'Aseo', icon: '🧹', color: 'bg-slate-100 text-slate-600' },
  { id: 'otros', nombre: 'Otros', icon: '📦', color: 'bg-gray-100 text-gray-600' },
];

export const PROVEEDORES: Proveedor[] = [
  {
    id: 'sanjorge',
    nombre: 'San Jorge',
    categorias: ['embutidos'],
    productos: [
      { id: 'sj-vienesa-personal', nombre: 'Vienesa Personal', presentacion: 'Paquete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'embutidos' },
      { id: 'sj-vienesa-gigante', nombre: 'Vienesa Gigante', presentacion: 'Paquete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'embutidos' },
      { id: 'sj-jamon', nombre: 'Jamón', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'embutidos' },
      { id: 'sj-chorizo', nombre: 'Chorizo', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'embutidos' }
    ]
  },
  {
    id: 'gag',
    nombre: 'GAG',
    categorias: ['mariscos', 'otros'],
    productos: [
      { id: 'gag-palmito', nombre: 'Palmito', presentacion: 'Tarro', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'otros' },
      { id: 'gag-champinon', nombre: 'Champiñon', presentacion: 'Bandeja', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'otros' },
      { id: 'gag-pulpa-jugos', nombre: 'Pulpa de jugos', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'otros' },
      
      { id: 'gag-anillo-calamar', nombre: 'Anillo de calamar', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'gag-camaron-36-40', nombre: 'Camarón 36/40', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'gag-camaron-100-200', nombre: 'Camarón 100/200', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'gag-pangasius', nombre: 'Pangasius', presentacion: 'Filete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'gag-merluza', nombre: 'Merluza', presentacion: 'Filete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'gag-reineta', nombre: 'Reineta', presentacion: 'Filete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' }
    ]
  },
  {
    id: 'ccu',
    nombre: 'CCU',
    categorias: ['bebestibles'],
    productos: [
      { id: 'ccu-cervezas', nombre: 'Cervezas', presentacion: 'Pack', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'bebestibles' }
    ]
  },
  {
    id: 'cocacola',
    nombre: 'Coca Cola',
    categorias: ['bebestibles'],
    productos: [
      { id: 'cc-bebidas', nombre: 'Bebidas', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'bebestibles' }
    ]
  },
  {
    id: 'pf',
    nombre: 'PF',
    categorias: ['embutidos', 'carnes'],
    productos: [
      { id: 'pf-jamon', nombre: 'Jamón', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'embutidos' },
      { id: 'pf-chorizo', nombre: 'Chorizo', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'embutidos' },
      { id: 'pf-tocino', nombre: 'Tocino', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'embutidos' },
      { id: 'pf-vienesa-grande', nombre: 'Vienesa Grande', presentacion: 'Paquete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'embutidos' },
      { id: 'pf-vienesa-pequena', nombre: 'Vienesa Pequeña', presentacion: 'Paquete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'embutidos' },
      { id: 'pf-tapapecho', nombre: 'Tapapecho', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'carnes' },
      { id: 'pf-lomo-vetado', nombre: 'Lomo Vetado', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'carnes' }
    ]
  },
  {
    id: 'olivo',
    nombre: 'Olivo',
    categorias: ['abarrotes', 'aseo', 'lacteos', 'otros'],
    productos: [
      { id: 'ol-nova', nombre: 'Nova', presentacion: 'Pack', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'aseo' },
      { id: 'ol-productos-aseo', nombre: 'Productos de aseo', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'aseo' },

      { id: 'ol-productos-peruanos', nombre: 'Productos peruanos', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'otros' },
      
      { id: 'ol-aceite-freidora', nombre: 'Aceite freidora', presentacion: 'Bidón', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'ol-aceite-litro', nombre: 'Aceite de litro', presentacion: 'Botella', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'ol-aceite-bidon', nombre: 'Aceite de bidón', presentacion: 'Bidón', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'abarrotes' },

      { id: 'ol-leche-evaporada', nombre: 'LECHE EVAPORADA IDEAL-LTA/390 (DSP/24 LTA LATA)', presentacion: 'lata', unidadesPorEnvase: 1, precioNetoUnidad: 1402.50, ivaPorcentaje: 19, categoria: 'lacteos' },
      { id: 'ol-leche-entera', nombre: 'LECHE ENTERA COLUN - CJA/12 LT CAJA', presentacion: 'lata', unidadesPorEnvase: 1, precioNetoUnidad: 961.12, ivaPorcentaje: 19, categoria: 'lacteos' },       
      { id: 'ol-crema-leche', nombre: 'CREMA DE LECHE COLUN - CJA/12 LT CAJA', presentacion: 'Litro', unidadesPorEnvase: 1, precioNetoUnidad: 3050.41, ivaPorcentaje: 19, categoria: 'lacteos' },

      
    ]
  },
  {
    id: 'dcarnes',
    nombre: "D' carnes",
    categorias: ['carnes'],
    productos: [
      { id: 'dc-carne', nombre: 'CARNE PARA AS', presentacion: '$ 8.566.10 x kg   IVA Incl.', unidadesPorEnvase: 1, precioNetoUnidad: 1092.88, ivaPorcentaje: 19, categoria: 'carnes' },
      { id: 'dc-carne', nombre: 'CHURRASCO 150 r (personal)', presentacion: '$ 8.566.10 x kg  IVA Incl.', unidadesPorEnvase: 1, precioNetoUnidad: 1091.08, ivaPorcentaje: 19, categoria: 'carnes' },
      { id: 'dc-carne', nombre: 'CHURRASCO 300  (gigante)', presentacion: '$ 8.566.10 x kg   IVA Incl.', unidadesPorEnvase: 1, precioNetoUnidad: 2187.56, ivaPorcentaje: 19, categoria: 'carnes' },
      { id: 'dc-carne', nombre: 'MOLIDA', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 4280, ivaPorcentaje: 19, categoria: 'carnes' }
    ]
  },
  
  {
    id: 'hojarasca',
    nombre: 'Hojarasca',
    categorias: ['panaderia'],
    productos: [
      { id: 'hj-hojarasca', nombre: 'Hojarasca', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'panaderia' }
    ]
  },
  {
    id: 'sanandres',
    nombre: 'San Andres',
    categorias: ['abarrotes', 'otros'],
    productos: [
      { id: 'sa-arroz', nombre: 'Arroz', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'sa-fetuccine', nombre: 'Fetuccine', presentacion: 'Paquete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'sa-azucar', nombre: 'Azúcar', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'sa-sal', nombre: 'Sal', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'sa-azucar-flor', nombre: 'Azúcar flor', presentacion: 'Bolsa', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'sa-sachet-cafe', nombre: 'Sachet Café', presentacion: 'Caja', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'sa-te', nombre: 'Té', presentacion: 'Caja', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'sa-salsa-tomate', nombre: 'Salsa de tomate', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'sa-sucedaneo-limon', nombre: 'Sucedáneo de limón', presentacion: 'Botella', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'abarrotes' }
    ]
  },
  {
    id: 'mancilla',
    nombre: 'Mancilla',
    categorias: ['mariscos'],
    productos: [
      { id: 'mn-pulpo', nombre: 'Pulpo', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mn-camaron', nombre: 'Camarón', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mn-anillo-calamar', nombre: 'Anillo de calamar', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mn-pangasuis', nombre: 'Pangasius', presentacion: 'Filete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mn-surtido-marisco', nombre: 'Surtido de marisco', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mn-navajuela', nombre: 'Navajuela', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mn-congrio', nombre: 'Congrio', presentacion: 'Filete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mn-reineta', nombre: 'Reineta', presentacion: 'Filete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mn-merluza', nombre: 'Merluza', presentacion: 'Filete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' }
    ]
  },
  {
    id: 'marinefood',
    nombre: 'MARINE FOOD',
    categorias: ['mariscos', 'otros'],
    productos: [
      { id: 'mf-papas-fritas', nombre: 'Papas Fritas', presentacion: 'Bolsa', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'otros' },
      { id: 'mf-pulpo', nombre: 'Pulpo', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mf-camaron', nombre: 'Camarón', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mf-anillo-calamar', nombre: 'Anillo de calamar', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mf-pangasuis', nombre: 'Pangasius', presentacion: 'Filete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mf-surtido-marisco', nombre: 'Surtido de marisco', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mf-navajuela', nombre: 'Navajuela', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mf-congrio', nombre: 'Congrio', presentacion: 'Filete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mf-reineta', nombre: 'Reineta', presentacion: 'Filete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'mf-merluza', nombre: 'Merluza', presentacion: 'Filete', unidadesPorEnvase: 1, precioNetoUnidad: 0, ivaPorcentaje: 19, categoria: 'mariscos' }
    ]
  }
];

