// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kiosco POS",
  description: "Punto de venta y control de stock",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* Fondo global gris muy suave para que las tarjetas blancas resalten */}
      <body className={`${inter.className} bg-gray-50/50 min-h-screen antialiased text-gray-900`}>
        <Navbar />
        {/* El "main" asegura que el contenido no quede pegado al menú */}
        <main className="max-w-7xl mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  )
}