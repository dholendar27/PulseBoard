import {z} from "zod";


const ROLE = ["ADMIN", "VIEWER"] as const
export const loginSchema = z.object({
    email: z.email("Invalid Email"),
    password: z.string().min(1, "Password is required")
})

export const userCreateSchema = z.object({
    email: z.email("Invalid Email"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(64, "Password must be at most 64 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z]).+$/,
            "Password must contain at least one lowercase and one uppercase letter"
        ),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().optional(),
    role: z.enum(ROLE)
})