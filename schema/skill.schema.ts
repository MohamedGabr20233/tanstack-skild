
import z from "zod";


export const submitSkillSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters long")
        .max(80, "Title must be 80 characters or fewer"),

    category: z
        .string()
        .trim()
        .min(3, "Category must be at least 3 characters long")
        .max(80, "Category must be 80 characters or fewer"),

    description: z
        .string()
        .trim()
        .min(20, "Description must be at least 20 characters long")
        .max(500, "Description must be 500 characters or fewer"),
    // transform: converts the validated input into a new output value
    //   (here: comma-separated string -> deduped, lowercased string[])
    // refine: custom validation check on the value; runs AFTER transform,
    //   so it receives the string[] and fails with the message if empty
    tags: z
        .string()
        .trim()
        .min(1, 'Please add at least one tag')
        .transform(str => [
            ...new Set(
                str.split(",").map(tag => tag.trim().toLowerCase()).filter(Boolean)
            )
        ])
        .refine((tags) => tags.length > 0, { message: "Tags must be comma-separated values (e.g. firebase , auth)" }
        ),

    installationCommand: z
        .string()
        .trim()
        .min(3, 'Install command is required')
        .max(200, "Install command must be 200 characters or fewer"),

    promptConfig: z
        .string()
        .trim()
        .min(10, "Prompt configuration must be at least 10 characters long")
        .max(4000, "Prompt configuration must be 4000 characters or fewer"),

    usageExample: z
        .string()
        .trim()
        .min(20, "Usage example must be at least 20 characters long")
        .max(4000, "Usage example must be 4000 characters or fewer"),

})


export const getSearchSkillsInputSchema = z.object({
    page: z.number().int().positive().catch(1).default(1),
    q: z.string().catch('').transform(value => value.trim()).optional(),
    category: z.string().catch('').transform(value => value.trim()).optional(),
    tags: z.string().catch('').transform(value => value.trim()).optional(),
})


export const getSkillByIdInputSchema = z.object({
    id: z.coerce.string().min(1, "Skill id is required")
})


export type SkillSchema = z.infer<typeof submitSkillSchema>