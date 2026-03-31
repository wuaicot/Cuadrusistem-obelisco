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

// Función auxiliar para calcular neto desde precio con IVA (19%)
const calcularNeto = (precioConIva: number) => Number((precioConIva / 1.19).toFixed(2));

export const PROVEEDORES: Proveedor[] = [
  {
    id: 'sanjorge',
    nombre: 'San Jorge',
    categorias: ['embutidos', 'lacteos'],
    productos: [
      { id: 'sj-vienesa-personal', nombre: 'Vienesa Personal', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(306.93), ivaPorcentaje: 19, categoria: 'embutidos' },
      { id: 'sj-vienesa-gigante', nombre: 'Vienesa Gigante', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(395.11), ivaPorcentaje: 19, categoria: 'embutidos' },
      { id: 'sj-jamon', nombre: 'Jamón', presentacion: 'Paquete', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1000.04), ivaPorcentaje: 19, categoria: 'embutidos' },
      { id: 'sj-chorizo', nombre: 'Chorizo', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(264.40), ivaPorcentaje: 19, categoria: 'embutidos' },
      { id: 'sj-tocino', nombre: 'Tocino', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(163.45), ivaPorcentaje: 19, categoria: 'embutidos' },
      { id: 'sj-queso-gouda', nombre: 'Queso Gouda', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(252.80), ivaPorcentaje: 19, categoria: 'lacteos' }
    ]
  },
  {
    id: 'gag',
    nombre: 'GAG',
    categorias: ['mariscos', 'otros', 'carnes'],
    productos: [
      { id: 'gag-anillos-calamar', nombre: 'Anillos de Calamar', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(5343.10), ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'gag-camaron-36-40', nombre: 'Camarón 36/40', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(5819.10), ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'gag-camaron-100-200', nombre: 'Camarón 100/200', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(3558.10), ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'gag-pangasius', nombre: 'Pangasius', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(3320.10), ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'gag-merluza', nombre: 'Merluza (congelada)', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(3558.10), ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'gag-mariscos-surtidos', nombre: 'Mariscos surtidos', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(3558.10), ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'gag-pechuga-desh', nombre: 'Pechuga DESH.', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(4034.10), ivaPorcentaje: 19, categoria: 'carnes' },
      { id: 'gag-tapa-pecho', nombre: 'Tapa pecho', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(8199.10), ivaPorcentaje: 19, categoria: 'carnes' },
      { id: 'gag-jaiba', nombre: 'Jaiba', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(14149.10), ivaPorcentaje: 19, categoria: 'mariscos' },
      { id: 'gag-lomo-liso', nombre: 'Lomo liso', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(11531.10), ivaPorcentaje: 19, categoria: 'carnes' }
    ]
  },
  {
    id: 'pf',
    nombre: 'PF',
    categorias: ['embutidos'],
    productos: [
      { id: 'pf-salchicha-g', nombre: 'Salchicha G', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(132.71), ivaPorcentaje: 19, categoria: 'embutidos' },
      { id: 'pf-salchicha-p', nombre: 'Salchicha P', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(157.87), ivaPorcentaje: 19, categoria: 'embutidos' }
    ]
  },
  {
    id: 'olivo',
    nombre: 'Olivo',
    categorias: ['abarrotes', 'aseo', 'lacteos'],
    productos: [
      { id: 'ol-aceite-freidora', nombre: 'Aceite freidora', presentacion: 'Bidón', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(2082.50), ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'ol-aceite-litro', nombre: 'Aceite de litro', presentacion: 'Botella', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1507.33), ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'ol-papas-fritas', nombre: 'Papas pre-fritas', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1546.97), ivaPorcentaje: 19, categoria: 'otros' },
      { id: 'ol-lava-loza', nombre: 'Lava loza', presentacion: 'Litro', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1248.79), ivaPorcentaje: 19, categoria: 'aseo' },
      { id: 'ol-arroz-miraflores', nombre: 'Arroz Miraflores', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(6177.53), ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'ol-queso-parmesano', nombre: 'Queso parmesano Colum', presentacion: 'Pieza', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(94931.06), ivaPorcentaje: 19, categoria: 'lacteos' },
      { id: 'ol-leche-evaporada', nombre: 'Leche evaporada Ideal', presentacion: 'Lata', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1668.98), ivaPorcentaje: 19, categoria: 'lacteos' },
      { id: 'ol-leche-entera', nombre: 'Leche entera Colum', presentacion: 'Litro', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1143.74), ivaPorcentaje: 19, categoria: 'lacteos' },
      { id: 'ol-ketchup-carozzi', nombre: 'Ketchup Carozzi', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1903.64), ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'ol-azucar-dorazol', nombre: 'Azúcar Dorazol 900GR', presentacion: 'Bolsa', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1051.96), ivaPorcentaje: 19, categoria: 'abarrotes' }
    ]
  },
  {
    id: 'dcarnes',
    nombre: "D' Carnes",
    categorias: ['carnes'],
    productos: [
      { id: 'dc-carne-as', nombre: 'Carne para AS', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1282.50), ivaPorcentaje: 19, categoria: 'carnes' },
      { id: 'dc-churrasco-150', nombre: 'Churrasco x 150gr', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1282.50), ivaPorcentaje: 19, categoria: 'carnes' },
      { id: 'dc-churrasco-300', nombre: 'Churrasco x 300gr', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(2565.10), ivaPorcentaje: 19, categoria: 'carnes' }
    ]
  },
  {
    id: 'bidfood',
    nombre: 'Bidfood',
    categorias: ['carnes'],
    productos: [
      { id: 'bf-pulpa-cerdo', nombre: 'Pulpa pierna Cerdo', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(4510.10), ivaPorcentaje: 19, categoria: 'carnes' },
      { id: 'bf-tapa-pecho', nombre: 'Tapa pecho', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(7604.10), ivaPorcentaje: 19, categoria: 'carnes' }
    ]
  },
  {
    id: 'ccu',
    nombre: 'CCU',
    categorias: ['bebestibles'],
    productos: [
      { id: 'ccu-bilz-lata', nombre: 'Bilz lata', presentacion: '350cc', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(749.70), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-kem-lata', nombre: 'Kem lata', presentacion: '350cc', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(749.82), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-pepsi-lata', nombre: 'Pepsi lata', presentacion: '350cc', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(749.82), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-limon-soda-lata', nombre: 'Limón Soda lata', presentacion: '350cc', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(749.82), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-pepsi-zero-lata', nombre: 'Pepsi Zero lata', presentacion: '350cc', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(749.82), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-pap-lata', nombre: 'Pap lata', presentacion: '350cc', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(749.70), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-ginger-ale-1-5', nombre: 'Ginger Ale 1 1/2', presentacion: '1.5 LT', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1956.36), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-bilz-1-5', nombre: 'Bilz 1 1/2', presentacion: '1.5 LT', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1956.12), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-limon-soda-1-5', nombre: 'Limón Soda 1 1/2', presentacion: '1.5 LT', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1956.12), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-kem-1-5', nombre: 'Kem 1 1/2', presentacion: '1.5 LT', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1956.12), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-heineken-1lt', nombre: 'Heineken 1 LT', presentacion: '1 LT', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1734.66), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-escudo-1lt', nombre: 'Escudo 1 LT', presentacion: '1 LT', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1657.31), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-cristal-1lt', nombre: 'Cristal 1 LT', presentacion: '1 LT', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1657.31), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-kunstman-torobayo', nombre: 'Kunstman Torobayo bot.', presentacion: 'Botella', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1804.28), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-heineken-0', nombre: 'Heineken 0° bot.', presentacion: 'Botella', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1115.86), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-royal-guard', nombre: 'Royal Guard bot.', presentacion: 'Botella', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1137.05), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-kunstman-0', nombre: 'Kunstman 0° bot.', presentacion: 'Botella', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1804.28), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'ccu-heineken-bot', nombre: 'Heineken bot.', presentacion: 'Botella', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1115.86), ivaPorcentaje: 19, categoria: 'bebestibles' }
    ]
  },
  {
    id: 'polo',
    nombre: 'Polo',
    categorias: ['abarrotes'],
    productos: [
      { id: 'polo-mostaza', nombre: 'Mostaza 1 Kg', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1213.80), ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'polo-chucrut', nombre: 'Chucrut 1 kg', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1892.10), ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'polo-mayonesa', nombre: 'Mayonesa 1 kg', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1773.10), ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'polo-pulpa-aji', nombre: 'Pulpa de Ají 1 kg', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(1535.10), ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'polo-pepinillos', nombre: 'Pepinillos 1 kg', presentacion: 'KG', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(4272.10), ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'polo-sachet-ketchup', nombre: 'Sachet Ketchup x caja', presentacion: 'Caja', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(14744.10), ivaPorcentaje: 19, categoria: 'abarrotes' },
      { id: 'polo-sal-sachet', nombre: 'Sal Sachet x caja', presentacion: 'Caja', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(7735.00), ivaPorcentaje: 19, categoria: 'abarrotes' }
    ]
  },
  {
    id: 'coca',
    nombre: 'Coca Cola',
    categorias: ['bebestibles'],
    productos: [
      { id: 'cc-lata-350', nombre: 'Coca Cola lata 350cc', presentacion: 'Lata', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(772.04), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'cc-zero-lata-350', nombre: 'Coca zero lata 350cc', presentacion: 'Lata', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(738.88), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'cc-sprite-lata-350', nombre: 'Sprite lata 350cc', presentacion: 'Lata', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(738.88), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'cc-sprite-zero-lata-350', nombre: 'Sprite Lata Zero 350cc', presentacion: 'Lata', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(738.88), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'cc-fanta-lata-350', nombre: 'Fanta lata 350cc', presentacion: 'Lata', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(739.10), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'cc-fanta-zero-lata-350', nombre: 'Fanta lata Zero 350cc', presentacion: 'Lata', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(738.87), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'cc-500', nombre: 'Coca Cola 500 cc', presentacion: 'Botella', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(912.53), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'cc-zero-500', nombre: 'Coca zero 500cc', presentacion: 'Botella', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(912.53), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'cc-sprite-500', nombre: 'Sprite 500cc', presentacion: 'Botella', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(912.41), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'cc-sprite-zero-500', nombre: 'Sprite Zero 500cc', presentacion: 'Botella', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(912.41), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'cc-fanta-500', nombre: 'fanta 500cc', presentacion: 'Botella', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(912.54), ivaPorcentaje: 19, categoria: 'bebestibles' },
      { id: 'cc-fanta-zero-500', nombre: 'Fanta Zero 500cc', presentacion: 'Botella', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(739.10), ivaPorcentaje: 19, categoria: 'bebestibles' }
    ]
  },
  {
    id: 'hojarascas',
    nombre: 'Hojarascas',
    categorias: ['panaderia'],
    productos: [
      { id: 'hj-masa', nombre: 'Masa de hojarasca', presentacion: 'Unidad', unidadesPorEnvase: 1, precioNetoUnidad: calcularNeto(320.00), ivaPorcentaje: 19, categoria: 'panaderia' }
    ]
  }
];
