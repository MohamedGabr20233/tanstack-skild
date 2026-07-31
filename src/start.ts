import { createStart } from '@tanstack/react-start'

// Clerk's request middleware was removed when auth moved to Supabase. It ran on every
// request and throws without Clerk keys configured, which would 500 the whole app.
export const startInstance = createStart(() => {
    return {}
})
