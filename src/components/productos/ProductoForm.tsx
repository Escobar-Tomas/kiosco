// src/components/productos/ProductoForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/services/supabaseBrowser'
import CamaraScanner from './CamaraScanner'

interface Categoria { id: string; nombre: string }
interface ProductoFormProps { onExito: () => void; onCancelar: () => void }

export default function ProductoForm({ onExito, onCancelar }: ProductoFormProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verCamara, setVerCamara] = useState(false)

  const [form, setForm] = useState({
    codigo_barras: '',
    codigo_interno: '',
    nombre: '',
    precio_costo: 0,
    precio_venta: 0,
    stock_actual: 0,
    stock_minimo: 5,
    categoria_id: ''
  })

  const supabase = createClient()

  useEffect(() => {
    async function cargarCategorias() {
      const { data, error } = await supabase
        .from('categorias')
        .select('id, nombre')
        .order('nombre')
      
      if (error) {
        console.error("⛔ ERROR SUPABASE AL CARGAR CATEGORÍAS:", error.message)
      } else if (data) {
        console.log("✅ Categorías cargadas:", data.length)
        setCategorias(data)
      }
    }
    cargarCategorias()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name.includes('precio') || name.includes('stock') ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim()) return setError('El nombre es obligatorio.')
    setLoading(true)

    try {
      const { error: dbError } = await supabase.from('productos').insert([{
        codigo_barras: form.codigo_barras.trim() || null,
        codigo_interno: form.codigo_interno.trim() || null,
        nombre: form.nombre.trim(),
        precio_costo: form.precio_costo,
        precio_venta: form.precio_venta,
        stock_actual: form.stock_actual,
        stock_minimo: form.stock_minimo,
        categoria_id: form.categoria_id || null,
        se_vende_por_peso: false,
        activo: true
      }])
      if (dbError) throw dbError
      onExito()
    } catch (err: any) {
      setError(err.message || 'Error al guardar.')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-5 rounded-xl border border-gray-200 shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-black text-gray-800 border-b pb-2">Registrar Producto</h2>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">⚠️ {error}</div>}

      {/* CÓDIGO DE BARRAS CON ACCESO A CÁMARA */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Código de Barras</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="codigo_barras"
            value={form.codigo_barras}
            onChange={handleInputChange}
            placeholder="Tipee o use la cámara"
            className="flex-1 px-3 py-2.5 border rounded-lg bg-gray-50 outline-none text-base"
          />
          <button
            type="button"
            onClick={() => setVerCamara(true)}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 rounded-lg flex items-center justify-center text-xl shadow-sm border border-blue-200 transition active:scale-95"
            title="Escanear con cámara"
          >
            📷
          </button>
        </div>
      </div>

      {verCamara && (
        <CamaraScanner 
          onCodigoDetectado={(codigo) => setForm(prev => ({ ...prev, codigo_barras: codigo }))}
          onCerrar={() => setVerCamara(false)}
        />
      )}

      {/* RESTO DE LOS CAMPOS EN FORMATO MOBILE-FIRST (COLUMNA ÚNICA) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Descripción / Nombre</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg bg-gray-50" />
        </div>
        
        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Categoría</label>
          <select name="categoria_id" value={form.categoria_id} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg bg-white h-[42px]">
            <option value="">-- Seleccionar --</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Costo ($)</label>
          <input type="number" name="precio_costo" value={form.precio_costo} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-mono" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Venta ($)</label>
          <input type="number" name="precio_venta" value={form.precio_venta} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-mono text-blue-600 font-bold" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Stock Inicial</label>
          <input type="number" name="stock_actual" value={form.stock_actual} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-mono" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mínimo</label>
          <input type="number" name="stock_minimo" value={form.stock_minimo} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-mono" />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t mt-4">
        <button type="button" onClick={onCancelar} className="flex-1 py-3 text-gray-500 font-semibold bg-gray-100 rounded-xl active:scale-95 transition">Cancelar</button>
        <button type="submit" disabled={loading} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl active:scale-95 transition disabled:opacity-50">
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}