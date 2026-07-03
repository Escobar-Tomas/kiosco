// src/components/pos/CarritoTabla.tsx
'use client'

import { ItemCarrito } from '@/models'

interface CarritoTablaProps {
  items: ItemCarrito[]
  onRemover: (index: number) => void
}

export default function CarritoTabla({ items, onRemover }: CarritoTablaProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
        <span className="text-5xl mb-2">🛒</span>
        <p className="text-center font-medium">Ningún producto escaneado aún.</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-y-auto border rounded-lg max-h-[60vh]">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b sticky top-0 shadow-sm z-10">
          <tr>
            <th className="p-3 text-gray-600 font-semibold">Detalle del Producto</th>
            <th className="p-3 text-gray-600 font-semibold text-center">Cant.</th>
            <th className="p-3 text-gray-600 font-semibold text-right">Precio</th>
            <th className="p-3 text-gray-600 font-semibold text-right">Subtotal</th>
            <th className="p-3 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.producto_id + index} className="border-b hover:bg-gray-50 transition-colors">
              <td className="p-3 font-medium text-gray-800">
                {item.nombre}
                {item.codigo_barras && (
                  <span className="block text-xs text-gray-400 font-mono">{item.codigo_barras}</span>
                )}
              </td>
              <td className="p-3 text-center font-mono text-gray-600">{item.cantidad}</td>
              <td className="p-3 text-right font-mono text-gray-600">${item.precio_unitario.toFixed(2)}</td>
              <td className="p-3 text-right font-mono font-semibold text-gray-900">${item.subtotal.toFixed(2)}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => onRemover(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-md transition"
                  title="Eliminar artículo"
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}