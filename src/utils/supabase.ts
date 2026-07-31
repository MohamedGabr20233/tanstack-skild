import { createBrowserClient } from "@supabase/ssr";

// Browser Supabase client (cookie-based storage via @supabase/ssr).
// Cookies are shared with the server, so the OAuth PKCE code verifier and the
// session are both readable server-side (beforeLoad, server functions).
export const supabase = createBrowserClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);
