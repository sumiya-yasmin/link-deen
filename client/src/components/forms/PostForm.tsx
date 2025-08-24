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
import { useEffect, useState } from 'react';
import { useCreatePost, useUpdatePost } from '@/hooks/usePostApis';
import { Post } from '@/types';

type PostFormProps = {
  post?: Post;
  onCancel: () => void;
  type: 'post' | 'hikmah';
};

function PostForm({ post, onCancel, type }: PostFormProps) {
  const [clearFilePreview, setClearFilePreview] = useState<() => void>(
    () => () => {}
  );

  const [preview, setPreview] = useState<string | null>(post?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: type ==='post'? {
        type: 'post',
      caption: post ? post?.caption : '',
      location: post ? post?.location : '',
      tags: post ? post.tags.join(',') : '',
    }:{
      type: 'hikmah',
        caption: post?.caption || '',
        tags: (post?.tags?.[0] as any) || 'dua',
        source: post?.source || '',
    },
  });

  useEffect(() => {
  form.reset(
    type === 'post'
      ? {
          type: 'post',
          caption: post?.caption || '',
          location: post?.location || '',
          tags: post?.tags.join(',') || '',
        }
      : {
          type: 'hikmah',
          caption: post?.caption || '',
          tags: (post?.tags?.[0] as 'ayah' | 'hadith' | 'dua' | 'reflection') || 'dua',
          source: post?.source || '',
        }
  );
}, [type]);

  const selectedTag = form.watch('tags') ?? ''

  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();

  async function onSubmit(data: z.infer<typeof postFormSchema>) {
    // setIsUploading(true);
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('caption', data.caption);

  if (data.type === 'post') {
    formData.append('location', data.location || '');
    formData.append('tags', data.tags || '');
  } else {
    formData.append('tags', data.tags);
    if (data.source) {
      formData.append('source', data.source);
    }
  }

    if (imageFile) formData.append('imageFile', imageFile);
    if (removeImage) formData.append('removeImage', 'true');

    if (post) {
      updatePost({ postId: post._id, formData });
      onCancel();
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
              onRemove={() => {
    setPreview(null);
    setImageFile(null);
    setRemoveImage(true); // mark for backend to delete
  }}
            />
          </FormItem>
          {type === 'post' && (
            <>
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
            </>
          )}
          {type === 'hikmah' && (
            <>
              {/* Dropdown for tag */}
              <FormField
                control={form.control}
                name="tags" // reuse tags field
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Select Category
                    </FormLabel>
                    <FormControl>
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="bg-dark-3 text-white px-4 py-2 rounded-md border border-dark-4"
                      >
                        <option value="dua">Dua</option>
                        <option value="ayah">Ayah</option>
                        <option value="hadith">Hadith</option>
                        <option value="reflection">Reflection</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Source field, only if tag is ayah or hadith */}
              {['ayah', 'hadith'].includes(selectedTag) && (
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Source</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Surah Al-Baqarah 2:286 or Sahih Bukhari 1:2"
                          className="bg-dark-3 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </>
          )}

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
