import { createFileRoute } from '@tanstack/react-router'
import { getSupabaseServerClient } from '#/utils/supabase.server'

export const Route = createFileRoute('/api/auth/callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // authCallbackUrl: full incoming URL carrying the OAuth code
        const authCallbackUrl = new URL(request.url)

        // oauthCode: one-time code Supabase gives us to trade for a session
        const oauthCode = authCallbackUrl.searchParams.get('code')

        // redirectTarget: where to land after login (defaults to home)
        const redirectTarget = authCallbackUrl.searchParams.get('next') ?? '/'

        // No code means the provider bounced us back with an error/cancel.
        if (!oauthCode) {
          return new Response(null, {
            status: 302,
            headers: { Location: '/sign-in/$?error=oauth' },
          })
        }

        const supabase = getSupabaseServerClient()

        // Exchange the code for a session; server client writes auth cookies.
        const { error } = await supabase.auth.exchangeCodeForSession(oauthCode)

        if (error) {
          return new Response(null, {
            status: 302,
            headers: {
              Location: `/sign-in/$?error=${encodeURIComponent(error.message)}`,
            },
          })
        }

        // Success: cookies are set, redirect into the app.
        return new Response(null, {
          status: 302,
          headers: { Location: redirectTarget },
        })
      },
    },
  },
})
