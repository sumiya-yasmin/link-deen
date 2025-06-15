import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { postFormSchema } from "@/lib/validation"
import { useState } from 'react';
import { useCreatePost } from '@/hooks/usePostApis';



interface Post {
    _id: string;
    caption: string;
    imageUrl: string; 
    location: string;
    tags: string[]; 
}
type PostFormProps = {
    post?: Post; 
}

function PostForm({post}: PostFormProps) {
  const [clearFilePreview, setClearFilePreview] = useState<() => void>(() => () => {});
  const createPostMutation = useCreatePost();

     // 1. Define your form.
  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      caption: post? post?.caption: "",
      file: [],
      location: post? post?.location:"",
      tags: post? post.tags.join(','): '',
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof postFormSchema>) {
      // setIsUploading(true);
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "file") return;
        formData.append(key, data[key as keyof typeof data] as string);
      });

      if (data.file && data.file.length > 0) {
        formData.append("imageFile", data.file[0]);
      }

     console.log(data)
     createPostMutation.mutate(formData, {
    onSuccess: () => {
      form.reset();
      clearFilePreview();
    },
   });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl ">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Caption</FormLabel>
              <FormControl>
                <Textarea className=" h-36 bg-dark-3 rounded-xl border-none focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3" placeholder="" {...field} />
              </FormControl>
              <FormMessage className="text-red" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Add Photos</FormLabel>
              <FormControl>
                <FileUploader 
                fieldChange={field.onChange}
                mediaUrl={post?.imageUrl}
                setClearFilePreview={setClearFilePreview}
                />
              </FormControl>
              <FormMessage className="text-red" />
            </FormItem>
          )}
        />
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
              <FormLabel className="text-white">Add Tags(separated by comma",")</FormLabel>
              <FormControl>
                <Input type="text" className="" placeholder="React, Js, NextJs " {...field} />
              </FormControl>
              <FormMessage className="text-red" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
        <Button type="button" className="h-12 bg-dark-4 px-5 text-light-1 flex gap-2 ">Cancel</Button>
        <Button type="submit"   disabled={createPostMutation.isPending} className="h-12 px-5 bg-[#CD7F32]">{createPostMutation.isPending ? "Creating..." : "Create"}</Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm;