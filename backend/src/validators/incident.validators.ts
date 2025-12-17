import z from "zod";


const STATUS = ["OPEN", "INVESTIGATING" ,"RESOLVED"] as const
export const incidentCreateValidator = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    assignee : z.string().optional()
})

export const incidentUpdateValidator = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    assignee : z.string().optional(),
    status: z.enum(STATUS)
})

export const incidentStatusValidator = z.object({
    status : z.enum(STATUS),
})