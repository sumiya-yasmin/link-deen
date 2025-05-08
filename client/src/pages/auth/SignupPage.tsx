import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { signupFormSchema } from '@/lib/validation';
import { Link} from 'react-router-dom';
import API from '@/lib/axios';
import { AxiosError } from 'axios';

const Signup = () => {
  const isLoading = false;
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const onSubmit = async (data: z.infer<typeof signupFormSchema>):Promise<void> => {
    try {
      const response = await API.post('/auth/signup', data);
      console.log('User created:', response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Signup failed:', error.response?.data.message || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }
  return (
    <>
    <div className="w-1/2 flex flex-col justify-center">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" text-center space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type='text' placeholder='Name' className='shad-input' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors'>{isLoading?(
        <div>Sigining Up...</div>
      ): 'Sign Up'}</Button>
      </form>
      
    </Form>
    <div className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{" "}
            <Link to="/signin" className="text-amber-600 hover:text-amber-500 font-medium">
              Sign In
            </Link>
          </div>
    
    </div>
    </>
  );
};

export default Signup;
