// src/components/pos/ScannerInput.tsx
'use client'

import { useRef, useEffect } from 'react'

interface ScannerInputProps {
  value: string
  onChange: (val: string) => void
  onScan: () => void
  placeholder?: string
}

export default function ScannerInput({ value, onChange, onScan, placeholder }: ScannerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Autofoco implacable: mantiene el foco activo para el lector físico
  useEffect(() => {
    inputRef.current?.focus()
  })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onScan()
    }
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder || "Escanee un código de barras..."}
      className="w-full text-lg px-4 py-3 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
    />
  )
}