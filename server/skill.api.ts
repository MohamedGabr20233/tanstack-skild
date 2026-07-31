import { createServerFn } from "@tanstack/react-start";
import { getSearchSkillsInputSchema, getSkillByIdInputSchema, submitSkillSchema } from '../schema/skill.schema';
import { getSupabaseServerClient } from "#/utils/supabase.server";
import type { SkillRecord } from "../type.d.ts";


type SupabaseServerClient = ReturnType<typeof getSupabaseServerClient>

/**
 * Marks which of these skills the current viewer has upvoted. One query for the whole
 * list rather than one per card; signed-out viewers skip it entirely.
 */
async function attachViewerVotes(supabase: SupabaseServerClient, skills: SkillRecord[]) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || skills.length === 0) {
        return skills.map((skill) => ({ ...skill, hasVoted: false }))
    }

    const { data: votes } = await supabase
        .from("skill_votes")
        .select("skill_id")
        .eq("user_id", user.id)
        .in("skill_id", skills.map((skill) => skill.id))

    const voted = new Set((votes ?? []).map((vote: { skill_id: string }) => vote.skill_id))

    return skills.map((skill) => ({ ...skill, hasVoted: voted.has(skill.id) }))
}


export const searchSkills = createServerFn({ method: "GET" })
    .validator(getSearchSkillsInputSchema)
    .handler(async ({ data }) => {

        // paginate
        const pageSize = 10
        const from = (data.page - 1) * pageSize   // page 1 → 0, page 2 → 10
        const to = from + pageSize - 1        // page 1 → 9, page 2 → 19

        // const peidning = await new Promise(resolve => setTimeout(resolve, 1000))

        const supabase = getSupabaseServerClient()
        let query = supabase
            .from("skills")
            .select('*')
            // most upvoted first, newest breaks ties so the order is stable
            .order("votes_count", { ascending: false })
            .order("created_at", { ascending: false })
            .range(from, to)

        if (data.q) {
            const pattern = `%${data.q}%`
            query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`)
        }

        if (data.category) {
            query = query.eq("category", data.category)
        }

        if (data.tags) {
            const tags = data.tags
                .split(",")
                .map((tag) => tag.trim().toLowerCase())
                .filter(Boolean)

            if (tags.length > 0) {
                query = query.overlaps("tags", tags)
            }
        }

        const { data: skills, error } = await query
        if (error) {
            return {
                success: false as const,
                message: error.message
            }
        }

        return {
            success: true as const,
            data: await attachViewerVotes(supabase, skills as SkillRecord[])
        }
    })

export const getSkills = createServerFn({ method: "GET" })
    .handler(async () => {
        const supabase = getSupabaseServerClient()

        const { data: skills, error } = await supabase
            .from("skills")
            .select('*')
            // most upvoted first, newest breaks ties so the order is stable
            .order("votes_count", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(5)

        if (error) {
            return {
                success: false as const,
                message: error.message
            }
        }

        return {
            success: true as const,
            data: await attachViewerVotes(supabase, skills as SkillRecord[])
        }
    })


export const getSkillById = createServerFn({ method: "GET" })
    .validator(getSkillByIdInputSchema)
    .handler(async ({ data }) => {
        const supabase = getSupabaseServerClient()

        const { data: skill, error } = await supabase
            .from("skills")
            .select("*")
            .eq("id", data.id)
            .maybeSingle()

        if (error) {
            return {
                success: false as const,
                message: error.message
            }
        }

        if (!skill) {
            return {
                success: false as const,
                message: "Skill not found"
            }
        }

        return {
            success: true as const,
            // the supabase client has no Database generic, so rows come back as `any`
            data: skill as SkillRecord
        }
    })


export const recordSkillInstall = createServerFn({ method: "POST" })
    .validator(getSkillByIdInputSchema)
    .handler(async ({ data }) => {
        const supabase = getSupabaseServerClient()

        // installs_count is maintained by a trigger, so always read it back
        const readCount = async () => {
            const { data: skill } = await supabase
                .from("skills")
                .select("installs_count")
                .eq("id", data.id)
                .maybeSingle()

            return skill?.installs_count ?? 0
        }

        // signed-out visitors still count, they just aren't attributed
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data: existing } = await supabase
                .from("skill_installs")
                .select("skill_id")
                .eq("skill_id", data.id)
                .eq("user_id", user.id)
                .maybeSingle()

            // already installed — not an error, the count just doesn't move
            if (existing) {
                return {
                    success: true as const,
                    alreadyInstalled: true,
                    installsCount: await readCount()
                }
            }
        }

        const { error } = await supabase
            .from("skill_installs")
            .insert({ skill_id: data.id, user_id: user?.id ?? null })

        // 23505 = unique violation: another tab won the race, treat as already installed
        if (error && error.code !== "23505") {
            return {
                success: false as const,
                message: error.message
            }
        }

        return {
            success: true as const,
            alreadyInstalled: Boolean(error),
            installsCount: await readCount()
        }
    })


export const toggleSkillVote = createServerFn({ method: "POST" })
    .validator(getSkillByIdInputSchema)
    .handler(async ({ data }) => {
        const supabase = getSupabaseServerClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (!user || authError) {
            return { success: false as const, message: "You must be signed in to upvote" }
        }

        const { data: existing } = await supabase
            .from("skill_votes")
            .select("skill_id")
            .eq("skill_id", data.id)
            .eq("user_id", user.id)
            .maybeSingle()

        // clicking again removes the vote
        const { error } = existing
            ? await supabase
                .from("skill_votes")
                .delete()
                .eq("skill_id", data.id)
                .eq("user_id", user.id)
            : await supabase
                .from("skill_votes")
                .insert({ skill_id: data.id, user_id: user.id })

        if (error) {
            return {
                success: false as const,
                message: error.message
            }
        }

        // votes_count is maintained by a trigger, so read it back instead of guessing
        const { data: skill } = await supabase
            .from("skills")
            .select("votes_count")
            .eq("id", data.id)
            .maybeSingle()

        return {
            success: true as const,
            hasVoted: !existing,
            votesCount: skill?.votes_count ?? 0
        }
    })


export const submitSkill = createServerFn({ method: "POST" })
    .validator(submitSkillSchema)
    .handler(async ({ data }) => {

        const supabase = getSupabaseServerClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (!user || authError) {
            return { success: false, message: "You must be signed in to submit a skill" }
        }


        const { data: skill, error } = await supabase.from("skills")
            .insert({
                slug: `${data.title}-${Date.now()}`,
                title: data.title,
                description: data.description,
                tags: data.tags,
                category: data.category,
                install_command: data.installationCommand,
                prompt_config: data.promptConfig,
                usage_example: data.usageExample
            }).select("id, slug, title, author_id, author_email, author_image").single()

        if (error) {
            return {
                success: false,
                message: error.message,
            }
        }

        return {
            success: true,
            message: "Skill submitted", skill, // includes author_id, author_email, author_image from trigger
        }

    })