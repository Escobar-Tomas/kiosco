// src/app/productos/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/services/supabaseBrowser'
import { Producto } from '@/models'
import ProductoForm from '@/components/productos/ProductoForm'

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [filtro, setFiltro] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  async function cargarProductos() {
    setLoading(true)
    const { data } = await supabase.from('productos').select('*, categories:categorias(nombre)').eq('activo', true).order('nombre')
    if (data) setProductos(data as any)
    setLoading(false)
  }

  useEffect(() => { cargarProductos() }, [])

  const filtrados = productos.filter(p => {
    const b = filtro.toLowerCase()
    return p.nombre.toLowerCase().includes(b) || (p.codigo_barras && p.codigo_barras.includes(b))
  })

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24 md:p-6">
      <div className="max-w-md mx-auto lg:max-w-6xl">
        
        {/* CABECERA */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Catálogo</h1>
            <p className="text-xs text-gray-500">Manejo de stock móvil</p>
          </div>
          {!mostrarFormulario && (
            <button onClick={() => setMostrarFormulario(true)} className="bg-blue-600 text-white text-sm font-bold py-2.5 px-4 rounded-xl shadow-md active:scale-95 transition">
              ➕ Nuevo
            </button>
          )}
        </div>

        {/* INPUT DE BÚSQUEDA */}
        {!mostrarFormulario && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="🔍 Buscar producto..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm outline-none text-base focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        {/* VISTA COMBINADA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {mostrarFormulario ? (
            <div className="lg:col-span-3">
              <ProductoForm onExito={() => { setMostrarFormulario(false); cargarProductos() }} onCancelar={() => setMostrarFormulario(false)} />
            </div>
          ) : (
            <div className="lg:col-span-2 space-y-3">
              {loading ? (
                <p className="text-center text-gray-500 py-10 font-medium">Cargando catálogo...</p>
              ) : filtrados.length === 0 ? (
                <p className="text-center text-gray-400 py-10">No hay productos.</p>
              ) : (
                <>
                  {/* MÓVIL: Vista de tarjetas simples (Oculto en pantallas grandes) */}
                  <div className="block lg:hidden space-y-2.5">
                    {filtrados.map(p => {
                      const critico = p.stock_actual <= p.stock_minimo
                      return (
                        <div key={p.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                          <div className="flex-1 pr-2">
                            <span className="font-bold text-gray-800 text-base block leading-tight">{p.nombre}</span>
                            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">
                              {(p as any).categories?.nombre || 'General'}
                            </span>
                            {p.codigo_barras && <span className="block text-xxs font-mono text-gray-400 mt-0.5">📦 {p.codigo_barras}</span>}
                          </div>
                          <div className="text-right flex flex-col items-end gap-1.5">
                            <span className="font-black text-gray-900 text-lg font-mono">${p.precio_venta.toFixed(2)}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${critico ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {p.stock_actual} un.
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* ESCRITORIO: Tabla tradicional (Oculto en celulares) */}
                  <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="p-3 text-xs font-bold text-gray-500 uppercase">Detalle</th>
                          <th className="p-3 text-xs font-bold text-gray-500 uppercase">Categoría</th>
                          <th className="p-3 text-xs font-bold text-gray-500 uppercase text-right">Venta</th>
                          <th className="p-3 text-xs font-bold text-gray-500 uppercase text-center">Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtrados.map(p => (
                          <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="p-3">
                              <span className="font-semibold text-gray-800 block">{p.nombre}</span>
                              <span className="text-xs text-gray-400 font-mono">{p.codigo_barras || 'Sin código'}</span>
                            </td>
                            <td className="p-3 text-gray-600 text-sm">{(p as any).categories?.nombre || 'General'}</td>
                            <td className="p-3 text-right font-mono font-bold text-gray-900">${p.precio_venta.toFixed(2)}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-bold font-mono ${p.stock_actual <= p.stock_minimo ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {p.stock_actual} un.
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}