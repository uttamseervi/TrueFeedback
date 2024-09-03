import { z } from "zod"
export const usernameValidation = z
    .string()
    .min(2, "Username must be of 2 characters")
    .max(30, "Username must be no more than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters ");


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Please enter the valid email address" }),
    password: z.string().max(16, { message: "Password should not exceed 16 characters" }).min(6, { message: "password must be at least 6 characters" })
})
