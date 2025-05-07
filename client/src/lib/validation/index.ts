import { z } from "zod"
export const signupFormSchema = z.object({
    name: z.string().min(2).max(50),
    username: z.string().min(2, {message: "Must be atleast of two characters"}),
    email: z.string().email(),
    password: z.string().min(8, {message: "Can not be less than 8 characters"}),
    confirmPassword: z.string()
  }).refine((data)=> data.password === data.confirmPassword,{
    message: "Passwords don't match",
    path: ["confirmPassword"]
})