import { getCookies, setCookie } from '@tanstack/react-start/server'
import { createServerClient } from '@supabase/ssr'

export function getSupabaseServerClient() {
    return createServerClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_KEY!,
        {
            cookies: {
                getAll() {
                    return Object.entries(getCookies()).map(([name, value]) => ({
                        name,
                        value,
                    }))
                },
                setAll(cookies) {
                    cookies.forEach((cookie) => {
                        // pass Supabase's cookie options (path, maxAge, sameSite,
                        // httpOnly) so the session cookie persists correctly
                        setCookie(cookie.name, cookie.value, cookie.options)
                    })
                },
            },
        },
    )
}