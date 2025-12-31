// src/domain/catalogo/catalogo.base.ts

import { CatalogoFactory, CatalogoProcesado } from './catalogo.factory';
import { ProductoEntity } from '../producto/producto.entity';

export type CatalogoProductos = Map<string, ProductoEntity>;
export const CATALOGO_BASE: CatalogoProcesado = (() => {
  const catalogo = CatalogoFactory.crearCatalogo();

  // =========================
  // BEBESTIBLES
  // =========================
  CatalogoFactory.agregarProductoBebestible(catalogo, {
    codigo: 'BEB_COCA_350',
    nombre: 'Coca-Cola 350cc',
  });

  CatalogoFactory.agregarProductoBebestible(catalogo, {
    codigo: 'BEB_AGUA',
    nombre: 'Agua Mineral',
  });

  // =========================
  // EMPANADAS
  // =========================
  CatalogoFactory.agregarProductoEmpanada(catalogo, {
    codigo: 'EMP_PINO',
    nombre: 'Empanada de Pino',
    ingredientes: [
      { nombre: 'MASA_EMP', cantidad: 1 },
      { nombre: 'RELLENO_PINO', cantidad: 1 },
    ],
  });

  CatalogoFactory.agregarProductoEmpanada(catalogo, {
    codigo: 'EMP_QUESO',
    nombre: 'Empanada de Queso',
    ingredientes: [
      { nombre: 'MASA_EMP', cantidad: 1 },
      { nombre: 'QUESO_MOZZ', cantidad: 120 },
    ],
  });

  // =========================
  // MENÚS
  // =========================
  CatalogoFactory.agregarProductoMenu(catalogo, {
    codigo: 'MENU_ITALIANO',
    nombre: 'Completo Italiano',
    ingredientes: [
      { nombre: 'PAN_COMPLETO', cantidad: 1 },
      { nombre: 'SALCHICHA', cantidad: 1 },
      { nombre: 'PALTA', cantidad: 80 },
      { nombre: 'TOMATE', cantidad: 60 },
      { nombre: 'MAYONESA', cantidad: 20 },
    ],
  });

  CatalogoFactory.agregarProductoMenu(catalogo, {
    codigo: 'MENU_CHACARERO',
    nombre: 'Completo Chacarero',
    ingredientes: [
      { nombre: 'PAN_COMPLETO', cantidad: 1 },
      { nombre: 'SALCHICHA', cantidad: 1 },
      { nombre: 'TOMATE', cantidad: 60 },
      { nombre: 'POROTO_VERDE', cantidad: 50 },
      { nombre: 'MAYONESA', cantidad: 20 },
    ],
  });

  return catalogo;
})();
