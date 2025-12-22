import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export async function createClient() {
  const strategy = process.env.DB_STRATEGY || "supabase"

  if (strategy === "local") {
    // Para o padrão Repository com banco local, você usaria um cliente PG aqui.
    // Como o projeto já usa Supabase, manteremos o createClient mas apontando 
    // para a variável LOCAL_DB_URL se necessário, ou simulando a conexão.
    // NOTA: Em uma implementação real de repositório, mudaríamos a instância
    // injetada no repositório.
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return [] },
          setAll() { }
        }
      }
    )
  }

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Ignored if called from Server Component
          }
        },
      },
    }
  )
}
