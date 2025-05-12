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
import { signinFormSchema} from '@/lib/validation';
import { Link, useNavigate } from 'react-router-dom';
import { useSignin } from '@/hooks/useSignIn.tsx';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

const Signin = () => {
const signinMutation = useSignin();
const { isAuthenticated } = useAuth();
const navigate = useNavigate();

useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit =  (
    data: z.infer<typeof signinFormSchema>
  ) => {
    signinMutation.mutate(data)
  };
  return (
    <>
      <div className="w-1/2 flex flex-col justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" text-center space-y-6"
          >
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
           
            <Button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
            >
              {signinMutation.isPending ? 'Sigining in...' : 'Sign In'}
            </Button>
            {signinMutation.error && (
            <p className="text-red-500 text-sm mt-2">
              {(signinMutation.error as any)?.response?.data?.message ??
                'An unexpected error occurred.'}
            </p>
          )}
          </form>
        </Form>
        <div className="text-center text-sm text-slate-500 mt-4">
          Don't have an account?{' '}
          <Link
            to="/auth/sign-up"
            className="text-amber-600 hover:text-amber-500 font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
};

export default Signin;