import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import FileUploader from '../shared/FileUploader';
import { postFormSchema } from '@/lib/validation';
import { useState } from 'react';
import { useCreatePost, useUpdatePost } from '@/hooks/usePostApis';
import { Post } from '@/types';


type PostFormProps = {
  post?: Post;
  onCancel: () => void;
};

function PostForm({ post, onCancel }: PostFormProps) {
  const [clearFilePreview, setClearFilePreview] = useState<() => void>(
    () => () => {}
  );

  const [preview, setPreview] = useState<string | null>(post?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      caption: post ? post?.caption : '',
      location: post ? post?.location : '',
      tags: post ? post.tags.join(',') : '',
    },
  });

  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();

  async function onSubmit(data: z.infer<typeof postFormSchema>) {
    // setIsUploading(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key as keyof typeof data] as string);
    });

    if (imageFile) formData.append('imageFile', imageFile);
    if (removeImage) formData.append('removeImage', 'true');

    if (post) {
      updatePost({ postId: post._id, formData });
    } else {
      createPost(formData);
    }
  }

  const handleFileChange = (files: File[]) => {
    const file = files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleCancel = () => {
  form.reset();
  setPreview(null);
  setImageFile(null);
  setRemoveImage(false);
  clearFilePreview();
  onCancel();
};
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-9 w-full max-w-5xl "
        >
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Caption</FormLabel>
                <FormControl>
                  <Textarea
                    className=" h-36 bg-dark-3 rounded-xl border-none focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3"
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red" />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel className="text-white">Add Photo</FormLabel>
            <FileUploader
              fieldChange={handleFileChange}
              mediaUrl={preview || post?.image}
              setClearFilePreview={setClearFilePreview}
            />
          </FormItem>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Add Location</FormLabel>
                <FormControl>
                  <Input type="text" className="" {...field} />
                </FormControl>
                <FormMessage className="text-red" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Add Tags(separated by comma",")
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className=""
                    placeholder="React, Js, NextJs "
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red" />
              </FormItem>
            )}
          />
          <div className="flex gap-4 items-center justify-end">
            <Button
              type="button"
              className="h-12 bg-dark-4 px-5 text-light-1 flex gap-2 "
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="h-12 px-5 bg-[#CD7F32]"
            >
              {post
                ? isUpdating
                  ? 'Updating...'
                  : 'Update'
                : isCreating
                ? 'Creating...'
                : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default PostForm;
