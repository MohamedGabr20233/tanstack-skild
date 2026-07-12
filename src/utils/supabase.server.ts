import { createServerClient } from '@supabase/ssr'
import { getRequest, appendResponseHeader } from '@tanstack/react-start/server'

export function createSupabaseServerClient() {
    const request = getRequest()

    return createServerClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_KEY!,
        {
            cookies: {
                getAll() {
                    const header = request?.headers.get('cookie') ?? ''
                    if (!header) return []
                    return header.split(';').map(pair => {
                        const eqIndex = pair.indexOf('=')
                        return {
                            name: pair.slice(0, eqIndex).trim(),
                            value: pair.slice(eqIndex + 1).trim(),
                        }
                    })
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        const parts = [`${name}=${value}`]
                        if (options?.path) parts.push(`Path=${options.path}`)
                        if (options?.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`)
                        if (options?.domain) parts.push(`Domain=${options.domain}`)
                        if (options?.sameSite) parts.push(`SameSite=${options.sameSite}`)
                        if (options?.httpOnly) parts.push('HttpOnly')
                        if (options?.secure) parts.push('Secure')
                        if (options?.expires instanceof Date) parts.push(`Expires=${options.expires.toUTCString()}`)
                        appendResponseHeader('Set-Cookie', parts.join('; '))
                    })
                },
            },
        }
    )
}