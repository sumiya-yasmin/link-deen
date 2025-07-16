import { z } from 'zod';
export const signupFormSchema = z
  .object({
    name: z.string().min(1).max(50),
    username: z
      .string()
      .min(3, { message: 'Must be atleast of two characters' }),
    email: z.string().email('Invalid email'),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const signinFormSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 6 characters' }),
});

export const postFormSchema = z.discriminatedUnion('type' ,[
  z.object({
    type: z.literal('post'),
    caption: z.string().max(2200, {
      message: 'Caption cant be more than 2200 characters.',
    }),
    location: z.string().max(100),
    tags: z.string(),
  }),
  z.object({
    type: z.literal('hikmah'),
    caption: z.string().min(1),
    tags: z.enum(['ayah', 'hadith', 'dua', 'reflection']),
    source: z.string().optional(),
  }),
]);
