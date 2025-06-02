 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"

const formSchema = z.object({
  caption: z.string().max(200, {
    message: "Caption cant be more than 200 characters.",
  }),
})

function PostForm(post) {
     // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
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
                <Input type="text" className="" />
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
                <Input type="text" className="" placeholder="React, Js, NextJs " />
              </FormControl>
              <FormMessage className="text-red" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
        <Button type="button" className="h-12 bg-dark-4 px-5 text-light-1 flex gap-2 ">Cancel</Button>
        <Button type="submit" className="h-12 px-5 bg-[#CD7F32]">Create</Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm