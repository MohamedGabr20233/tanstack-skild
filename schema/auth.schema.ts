import z from "zod";


export const SignUpSchema = z

    .object({
        email: z.email(),

        password: z.string().min(8),

        confirmPassword: z.string(),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    );

export const SignInSchema = z.object({
    email: z
        .email("Please enter a valid email")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});