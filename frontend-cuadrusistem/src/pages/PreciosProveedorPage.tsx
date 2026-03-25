import { useState, useMemo } from 'react';
import { CATEGORIAS_COCINA, PROVEEDORES, type Categoria, type Proveedor, type ProductoProveedor } from '../data/preciosData';

export function PreciosProveedorPage() {
  const [view, setView] = useState<'categorias' | 'proveedores' | 'productos'>('categorias');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [selectedProv, setSelectedProv] = useState<Proveedor | null>(null);

  const filteredProviders = useMemo(() => {
    if (!selectedCat) return [];
    return PROVEEDORES.filter(p => p.categorias.includes(selectedCat));
  }, [selectedCat]);

  const filteredProducts = useMemo(() => {
    if (!selectedProv || !selectedCat) return [];
    return selectedProv.productos.filter(p => p.categoria === selectedCat);
  }, [selectedProv, selectedCat]);

  const handleCategoryClick = (catId: string) => {
    setSelectedCat(catId);
    setView('proveedores');
  };

  const handleProviderClick = (prov: Proveedor) => {
    setSelectedProv(prov);
    setView('productos');
  };

  const handleBack = () => {
    if (view === 'productos') setView('proveedores');
    else if (view === 'proveedores') setView('categorias');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20">
      {/* Header Contextual */}
      <div className="sticky top-0 bg-white shadow-sm p-4 z-10 flex items-center gap-3">
        {view !== 'categorias' && (
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h2 className="text-xl font-bold text-gray-800">
          {view === 'categorias' && 'Categorías'}
          {view === 'proveedores' && `Proveedores: ${CATEGORIAS_COCINA.find(c => c.id === selectedCat)?.nombre}`}
          {view === 'productos' && selectedProv?.nombre}
        </h2>
      </div>

      <div className="p-4">
        {/* VISTA CATEGORÍAS (Grid estilo Pedidos Ya) */}
        {view === 'categorias' && (
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIAS_COCINA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-transparent hover:border-blue-500 transition-all active:scale-95 group"
              >
                <span className={`text-4xl mb-3 p-4 rounded-full ${cat.color} group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </span>
                <span className="font-semibold text-gray-700">{cat.nombre}</span>
              </button>
            ))}
          </div>
        )}

        {/* VISTA PROVEEDORES */}
        {view === 'proveedores' && (
          <div className="space-y-3">
            {filteredProviders.length > 0 ? (
              filteredProviders.map((prov) => (
                <button
                  key={prov.id}
                  onClick={() => handleProviderClick(prov)}
                  className="w-full flex items-center justify-between p-5 bg-white rounded-xl shadow-sm border border-gray-100 active:bg-blue-50 transition-colors text-left"
                >
                  <div>
                    <span className="block font-bold text-lg text-gray-800">{prov.nombre}</span>
                    <span className="text-sm text-gray-500">{prov.productos.filter(p => p.categoria === selectedCat).length} productos disponibles</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              ))
            ) : (
              <div className="text-center py-10">
                <span className="text-5xl block mb-4">🔍</span>
                <p className="text-gray-500 font-medium">No hay proveedores registrados para esta categoría.</p>
              </div>
            )}
          </div>
        )}

        {/* VISTA PRODUCTOS Y PRECIOS */}
        {view === 'productos' && (
          <div className="space-y-4">
            {filteredProducts.map((prod) => {
              const precioIva = prod.precioNetoUnidad * (1 + (prod.ivaPorcentaje / 100));
              const precioCajaNeto = prod.precioNetoUnidad * prod.unidadesPorEnvase;
              const precioCajaTotal = precioIva * prod.unidadesPorEnvase;

              return (
                <div key={prod.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                  <div className="bg-blue-600 p-4 text-white">
                    <h3 className="font-bold text-lg leading-tight">{prod.nombre}</h3>
                    <p className="text-blue-100 text-sm font-medium opacity-90">{prod.presentacion}</p>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    {/* Precio Unitario */}
                    <div className="flex justify-between items-end border-b border-gray-50 pb-3">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Precio Unitario</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-gray-900">{formatCurrency(precioIva)}</span>
                          <span className="text-xs text-green-600 font-bold">IVA Incl.</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block italic">Neto: {formatCurrency(prod.precioNetoUnidad)}</span>
                      </div>
                    </div>

                    {/* Detalle por Envase/Caja */}
                    {prod.unidadesPorEnvase > 1 && (
                      <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <span className="block text-xs font-bold text-gray-500 uppercase">Total {prod.presentacion.includes('CJA') ? 'Caja' : 'Envase'}</span>
                          <span className="text-xl font-bold text-blue-700">{formatCurrency(precioCajaTotal)}</span>
                        </div>
                        <div className="text-right text-xs text-gray-500 font-medium">
                          <span>{prod.unidadesPorEnvase} unidades</span>
                          <span className="block">Neto: {formatCurrency(precioCajaNeto)}</span>
                        </div>
                      </div>
                    )}

                    {/* Tag de Oferta (Placeholder) */}
                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 p-2 rounded-lg">
                      <span className="text-lg">💡</span>
                      <p className="text-[10px] text-yellow-800 leading-tight">
                        Compara este precio con el del mercado actual. Si es menor a <span className="font-bold">{formatCurrency(precioIva * 1.1)}</span>, ¡es una buena oferta!
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
