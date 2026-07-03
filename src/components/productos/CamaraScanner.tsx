// src/components/productos/CamaraScanner.tsx
'use client'

import { useState } from 'react'
import { useZxing } from 'react-zxing'

interface CamaraScannerProps {
  onCodigoDetectado: (codigo: string) => void
  onCerrar: () => void
}

export default function CamaraScanner({ onCodigoDetectado, onCerrar }: CamaraScannerProps) {
  const [procesando, setProcesando] = useState(false)

  const { ref } = useZxing({
    onDecodeResult(result) {
      if (procesando) return
      setProcesando(true)

      const codigoStr = result.rawValue
      
      // 1. Mandamos el código al formulario
      onCodigoDetectado(codigoStr)
      
      // 2. FORZAMOS EL CIERRE AUTOMÁTICO AL INSTANTE
      onCerrar()
    },
    paused: procesando 
  })

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
      {/* Tarjeta con fondo BLANCO para máximo contraste */}
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
        
        {/* Cabecera clara con texto oscuro */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 text-gray-800 relative z-20">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span className="text-blue-600">📹</span> Escanear Producto
          </h3>
          <button 
            type="button"
            onClick={onCerrar} 
            className="text-gray-500 hover:text-gray-800 hover:bg-gray-200 text-xl p-1 rounded-full w-8 h-8 flex items-center justify-center active:scale-90 transition"
          >
            ✕
          </button>
        </div>

        <div className="relative w-full bg-black min-h-[300px] flex justify-center items-center overflow-hidden">
          
          <video ref={ref} className="w-full h-full object-cover" />
          
          {/* GUÍA RECTANGULAR HORIZONTAL (Forma de Código de Barras) */}
          {!procesando && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-28 border-[3px] border-green-500 rounded-lg pointer-events-none shadow-[0_0_0_4000px_rgba(0,0,0,0.65)] flex items-center justify-center">
               {/* Línea roja decorativa simulando el láser */}
               <div className="w-[90%] h-[2px] bg-red-500/50 shadow-[0_0_8px_2px_rgba(239,68,68,0.5)]"></div>
            </div>
          )}

          {procesando && (
            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
              <span className="text-6xl mb-4 animate-bounce">✅</span>
            </div>
          )}
        </div>

        {/* Pie de tarjeta con letras bien legibles */}
        <div className="p-4 bg-gray-50 text-center text-sm font-medium text-gray-600 border-t border-gray-200">
          {procesando ? (
            <span className="text-green-600 font-bold">¡Código capturado! Cerrando...</span>
          ) : (
            'Alinee el código de barras con la línea roja.'
          )}
        </div>
      </div>
    </div>
  )
}