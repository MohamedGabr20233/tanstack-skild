import { PostHogProvider, usePostHog } from "@posthog/react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { supabase } from "#/utils/supabase";
import Crosshair from "#/components/Crosshair";
import Navbar from "#/components/Navbar";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";
import { Toaster } from "sonner";
import { getCurrentProfile, getCurrentUser } from "../../server/auth.api";
import type { profileSchema } from "../../type";


interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Skild  - The Registry for Agentic Intelligence",
      },
      {
        name: "description",
        content: "Discover , publish , and operate reusable agent capabilities from a route-driven workspace.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,

  loader: async () => {
    const data = await getCurrentProfile()

    return data as profileSchema | null
  }
});

function PostHogIdentify() {
  const posthog = usePostHog()

  useEffect(() => {
    // identifySupabaseUser: push current auth user identity into PostHog
    const identifySupabaseUser = (authenticatedUser: import("@supabase/supabase-js").User | null) => {
      if (authenticatedUser) {
        posthog.identify(authenticatedUser.id, {
          email: authenticatedUser.email,
          name:
            authenticatedUser.user_metadata?.full_name ??
            authenticatedUser.user_metadata?.name,
        })
      } else {
        posthog.reset()
      }
    }

    // initial identify on first page load
    supabase.auth.getUser().then(({ data: { user: initialUser } }) => {
      identifySupabaseUser(initialUser)

    })

    // re-identify whenever auth state changes (sign in / sign out)
    const {
      data: { subscription: authStateSubscription },
    } = supabase.auth.onAuthStateChange((_authEvent, currentSession) => {
      identifySupabaseUser(currentSession?.user ?? null)
    })

    return () => authStateSubscription.unsubscribe()
  }, [posthog])

  return null
}

function RootDocument({ children }: { children: React.ReactNode }) {
  // the logged user data if there is any

  const user = Route.useLoaderData()
  return (
    <html lang="en" suppressContentEditableWarning className="dark">
      <head>
        <HeadContent />
      </head>

      <body>
        <PostHogProvider
          apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ?? ""}
          options={{
            api_host: '/ingest',
            ui_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com',
            defaults: '2025-05-24',
            capture_exceptions: true,
            debug: false,
          }}
        >
          {/* Sync Supabase user identity into PostHog on auth state changes */}
          <PostHogIdentify />
          <div id="root-layout">
            <header>
              <div className="frame">
                <Navbar user={user} />
                <Crosshair />
                <Crosshair />
              </div>
            </header>

            <main>
              <div className="frame">{children}</div>
            </main>
          </div>
        </PostHogProvider>

        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />

        <Toaster />
      </body>
    </html>
  );
}
