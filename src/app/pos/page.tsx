// src/app/pos/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/services/supabaseBrowser'
import { ItemCarrito, Producto } from '@/models'
import ScannerInput from '@/components/pos/ScannerInput'
import CarritoTabla from '@/components/pos/CarritoTabla'
import PanelCobro from '@/components/pos/PanelCobro'

export default function PosPage() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [codigoBusqueda, setCodigoBusqueda] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  // Instanciamos el cliente de Supabase para el navegador
  const supabase = createClient()

  const manejarEscaneo = async () => {
    const codigo = codigoBusqueda.trim()
    if (!codigo) return
    
    setError(null)

    try {
      // Buscamos el producto en Supabase por código de barras
      const { data, error: dbError } = await supabase
        .from('productos')
        .select('*')
        .eq('codigo_barras', codigo)
        .eq('activo', true)
        .single()

      if (dbError) {
        if (dbError.code === 'PGRST116') {
          setError(`El producto con código "${codigo}" no existe.`)
        } else {
          throw dbError
        }
        setCodigoBusqueda('')
        return
      }

      const producto = data as Producto

      // Verificamos si el producto ya está en el carrito para incrementar cantidad
      setCarrito(prev => {
        const index = prev.findIndex(item => item.producto_id === producto.id)
        
        if (index > -1) {
          const nuevoCarrito = [...prev]
          const item = nuevoCarrito[index]
          const nuevaCantidad = item.cantidad + 1
          
          nuevoCarrito[index] = {
            ...item,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * item.precio_unitario
          }
          return nuevoCarrito
        } else {
          // Si no está, lo agregamos como un ítem nuevo
          return [...prev, {
            producto_id: producto.id,
            nombre: producto.nombre,
            codigo_barras: producto.codigo_barras,
            cantidad: 1,
            precio_unitario: producto.precio_venta,
            subtotal: producto.precio_venta
          }]
        }
      })

    } catch (err: any) {
      console.error('Error al escanear:', err.message)
      setError('Hubo un error al consultar la base de datos.')
    } finally {
      setCodigoBusqueda('') // Limpiamos para el siguiente escaneo
    }
  }

  const removerItem = (index: number) => {
    setCarrito(prev => prev.filter((_, i) => i !== index))
  }

  const finalizarVenta = async (metodoPago: 'efectivo' | 'transferencia') => {
    // TODO: Aquí implementaremos el guardado transaccional de la venta en la V2
    // Por ahora, limpiamos el carrito simulando el éxito
    alert(`¡Venta registrada con éxito! Método: ${metodoPago.toUpperCase()}`)
    setCarrito([])
  }

  const totalCaja = carrito.reduce((acc, item) => acc + item.subtotal, 0)

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col md:flex-row gap-6">
      {/* Contenedor Principal Izquierdo: Escáner y Lista de Compra */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-md flex flex-col h-[calc(100vh-3rem)]">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Caja Registradora</h1>
          
          <ScannerInput
            value={codigoBusqueda}
            onChange={setCodigoBusqueda}
            onScan={manejarEscaneo}
            placeholder="Escanee el código de barras del artículo..."
          />

          {error && (
            <div className="mt-2 p-2 bg-red-50 text-red-600 rounded-md text-sm font-medium">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Área de la Grilla de Productos */}
        <div className="flex-1 overflow-hidden mt-2">
          <CarritoTabla items={carrito} onRemover={removerItem} />
        </div>
      </div>

      {/* Contenedor Derecho: Resumen Financiero y Cobro */}
      <div className="w-full md:w-96 h-fit md:h-[calc(100vh-3rem)]">
        <PanelCobro
          total={totalCaja}
          onFinalizarVenta={finalizarVenta}
          disabled={carrito.length === 0}
        />
      </div>
    </div>
  )
}