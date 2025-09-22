'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento inicial
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // Para demo, aceitar credenciais simples
      if (email === 'admin' && password === 'admin') {
        const mockUser = {
          id: '1',
          email: 'admin@soluzionegiusta.com',
          user_metadata: { name: 'Admin' },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString()
        } as User
        setUser(mockUser)
        return { data: { user: mockUser }, error: null }
      }

      // Tentar Supabase apenas se as variáveis estiverem disponíveis
      if (typeof window !== 'undefined' && 
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const result = await supabase.auth.signInWithPassword({ email, password })
        if (result.data.user) {
          setUser(result.data.user)
        }
        return result
      }

      return { data: null, error: { message: 'Credenciais inválidas' } }
    } catch {
      return { data: null, error: { message: 'Erro ao fazer login' } }
    }
  }

  const signOut = async () => {
    setUser(null)
    return { error: null }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
  }
}
