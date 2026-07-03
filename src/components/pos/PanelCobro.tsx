// src/components/pos/PanelCobro.tsx
'use client'

import { useState } from 'react'

interface PanelCobroProps {
  total: number
  onFinalizarVenta: (metodoPago: 'efectivo' | 'transferencia') => void
  disabled: boolean
}

export default function PanelCobro({ total, onFinalizarVenta, disabled }: PanelCobroProps) {
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'transferencia'>('efectivo')

  return (
    <div className="w-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Resumen de Operación</h2>
        
        {/* Selector de método de pago */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-600 mb-2">Forma de Pago</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMetodoPago('efectivo')}
              className={`py-3 px-4 rounded-lg font-bold border transition text-center ${
                metodoPago === 'efectivo'
                  ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              💵 Efectivo
            </button>
            <button
              type="button"
              onClick={() => setMetodoPago('transferencia')}
              className={`py-3 px-4 rounded-lg font-bold border transition text-center ${
                metodoPago === 'transferencia'
                  ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              📱 Transferencia
            </button>
          </div>
        </div>
      </div>

      {/* Bloque del Totalizador Financiero */}
      <div className="mt-6">
        <div className="flex justify-between items-baseline mb-6 bg-gray-50 p-4 rounded-lg border">
          <span className="text-gray-700 font-semibold text-lg">Total a Cobrar:</span>
          <span className="text-3xl font-black text-blue-600 font-mono">${total.toFixed(2)}</span>
        </div>
        
        <button
          onClick={() => onFinalizarVenta(metodoPago)}
          disabled={disabled || total <= 0}
          className="w-full bg-green-600 text-white font-black text-lg py-4 px-6 rounded-xl hover:bg-green-700 active:scale-[0.99] transition disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 shadow-md shadow-green-100"
        >
          Confirmar y Registrar
        </button>
      </div>
    </div>
  )
}