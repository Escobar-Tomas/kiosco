// src/components/layout/Navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: '/pos', label: 'Caja Registradora', icon: '🛒' },
    { href: '/productos', label: 'Catálogo & Stock', icon: '📦' }
  ]

  // Si estamos en la página de login (la raíz), no mostramos la barra
  if (pathname === '/') return null

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16">
          
          {/* Logo / Marca */}
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-2xl">🏪</span>
            <span className="font-black text-xl text-blue-600 tracking-tight">Kiosco<span className="text-gray-800">POS</span></span>
          </div>

          {/* Enlaces de Navegación */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {links.map((link) => {
              const activo = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                    activo 
                      ? 'bg-blue-50 text-blue-700 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.2)]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="hidden sm:block">{link.label}</span>
                </Link>
              )
            })}
          </div>
          
        </div>
      </div>
    </nav>
  )
}