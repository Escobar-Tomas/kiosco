// src/models/index.ts

export interface Producto {
  id: string;
  codigo_barras: string | null;
  codigo_interno: string | null;
  nombre: string;
  precio_costo: number;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
  se_vende_por_peso: boolean;
  categoria_id?: string;
  proveedor_id?: string;
  activo: boolean;
}

export interface ItemCarrito {
  producto_id: string;
  nombre: string;
  codigo_barras: string | null;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}