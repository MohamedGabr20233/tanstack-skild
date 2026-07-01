import { ClerkProvider } from '@clerk/tanstack-react-start'
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import Crosshair from "#/components/Crosshair";
import Navbar from "#/components/Navbar";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

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

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressContentEditableWarning className="dark">
      <head>
        <HeadContent />
      </head>

      <body>
        <ClerkProvider>
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
      </body>
    </html>
  );
}
