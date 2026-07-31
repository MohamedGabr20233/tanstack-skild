import { getRouteApi } from "@tanstack/react-router";
import type { profileSchema } from "../../type";


// select the required page to load the data from (root for the auth where its first made)
// its only accessible for child root like contextApi
const rootRouteApi = getRouteApi("__root__")

export function useAuth() {
    const currentProfile = rootRouteApi.useLoaderData() as profileSchema | null

    return {
        profile: currentProfile,

        isAuthed: Boolean(currentProfile)
    }
}


