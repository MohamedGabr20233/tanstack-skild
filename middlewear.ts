import { getSupabaseServerClient } from "#/utils/supabase.server";
import { createMiddleware } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router"

export const authMiddleware = createMiddleware().server(
    async ({ next, }) => {
        const supabase = getSupabaseServerClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (!user || error) {
            throw redirect({ to: "/sign-in/$" })
        }

        return next({
            context: { user, supabase }
        })
    }
)