import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Retornar um cliente mock para desenvolvimento
    return {
      auth: {
        signInWithPassword: async () => ({ data: null, error: { message: 'Supabase não configurado' } }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      }
    } as unknown as ReturnType<typeof createBrowserClient>
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
