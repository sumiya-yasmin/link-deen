import { z } from 'zod';
export const createPostSchema = z
  .object({
    caption: z
      .string()
      .max(2200, {
        message: 'Caption cant be more than 200 characters.',
      })
      .optional(),
    location: z.string().max(100).optional(),
    tags: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.caption?.trim() || true;
    },
    {
      message: 'Please provide either a caption or upload an image',
    }
  );

export const updatePostSchema = z.object({
  caption: z
    .string()
    .max(2200, 'Caption cannot be more than 2200 characters')
    .optional(),
  location: z
    .string()
    .max(100, 'Location cannot be more than 100 characters')
    .optional(),
  tags: z.string().optional(),
});

export const commentSchema = z.object({
  text: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment cannot be more than 500 characters'),
});
