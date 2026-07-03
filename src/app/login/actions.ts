// src/app/login/actions.ts
'use server'

import { createClient } from '@/services/supabaseServer'
import { redirect } from 'next/navigation'

export async function iniciarSesion(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Si la clave es incorrecta, recargamos la página con un parámetro de error
    redirect('/login?error=Credenciales+incorrectas')
  }

  // Si todo sale bien, redirigimos a la ruta de nuestro kiosco
  redirect('/pos') 
}