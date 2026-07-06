import { ClerkProvider, useUser } from "@clerk/tanstack-react-start";
import { PostHogProvider, usePostHog } from "@posthog/react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import Crosshair from "#/components/Crosshair";
import Navbar from "#/components/Navbar";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";
import { Toaster } from "sonner";

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
});

function PostHogIdentify() {
  const posthog = usePostHog()
  const { user, isSignedIn } = useUser()

  useEffect(() => {
    if (isSignedIn && user) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      })
    } else if (!isSignedIn) {
      posthog.reset()
    }
  }, [isSignedIn, user, posthog])

  return null
}

function RootDocument({ children }: { children: React.ReactNode }) {
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
            debug: import.meta.env.DEV,
          }}
        >
          <ClerkProvider>
            {/* Sync Clerk user identity into PostHog on auth state changes */}
            <PostHogIdentify />
            <div id="root-layout">
              <header>
                <div className="frame">
                  <Navbar />
                  <Crosshair />
                  <Crosshair />
                </div>
              </header>

              <main>
                <div className="frame">{children}</div>
              </main>
            </div>
          </ClerkProvider>
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
