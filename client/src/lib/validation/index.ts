import { z } from "zod"
export const signupFormSchema = z.object({
    name: z.string().min(1).max(50),
    username: z.string().min(3, {message: "Must be atleast of two characters"}),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, {message: "Password must be at least 6 characters"}),
    confirmPassword: z.string()
  }).refine((data)=> data.password === data.confirmPassword,{
    message: "Passwords don't match",
    path: ["confirmPassword"]
})