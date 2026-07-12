
import z, { string } from "zod";


export const submitSkillSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters long")
        .max(80, "Title must be 80 characters or fewer"),

    description: z
        .string()
        .trim()
        .min(20, "Description must be at least 20 characters long")
        .max(500, "Description must be 500 characters or fewer"),
    // refine is used to make callback function to the string
    tags: z
        .string()
        .trim()
        .min(1, 'Please add at least one tag')
        .refine((str) =>
            str.split(",")
                .map((tag) => tag.trim())
                .filter(Boolean).length > 0,

            { message: "Tags must be comma-separated values (e.g. firebase , auth)" }
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
