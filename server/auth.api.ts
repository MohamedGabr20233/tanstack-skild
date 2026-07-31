import { createServerFn } from "@tanstack/react-start";
import { SignInSchema, SignUpSchema } from "../schema/auth.schema";
import { getSupabaseServerClient } from "#/utils/supabase.server";

// sign up

export const signup = createServerFn({ method: "POST" })
    .validator(SignUpSchema)
    .handler(async ({ data }) => {
        const { email, password } = data


        const supabase = getSupabaseServerClient()

        const { data: userData, error } = await supabase.auth.signUp({
            email, password
        })

        if (error) {
            console.error(error);

            throw new Error(error.message);
        }

        if (!userData.user) {
            throw new Error("Something went wrong");
        }

        return {
            userId: userData.user.id,
            // requiresEmailConfirmation: !userData.session,
        };
    })


export const singIn = createServerFn({ method: "POST" })
    .validator(SignInSchema)
    .handler(async ({ data }) => {
        const supabase = getSupabaseServerClient()

        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password
        });

        if (error) {
            throw new Error(error.message)
        }
        return {
            user: authData.user,
            session: authData.session
        }

    })


// get the User_Key

export const getCurrentUser = createServerFn({
    method: "GET",
}).handler(async () => {
    const supabase = getSupabaseServerClient()

    const {
        data: { user },
        error
    } = await supabase.auth.getUser()


    if (error || !user) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata,
    };
})

// get current profile


export const getCurrentProfile = createServerFn({
    method: "GET"
}).handler(async () => {
    const supabase = getSupabaseServerClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (!user || userError) {
        return null
    }

    // use the profile table

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()

    console.log(profile)
    if (profileError) {
        throw new Error(profileError.message)
    }

    return profile
})



// sign out 

export const signOut = createServerFn({ method: "POST" })
    .handler(async () => {
        const supabase = getSupabaseServerClient()

        const { error } = await supabase.auth.signOut()
        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
        };

    })