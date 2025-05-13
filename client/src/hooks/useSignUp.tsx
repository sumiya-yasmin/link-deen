import { signUpMutation } from '@/api/auth';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
export const useSignup = () =>{
    const navigate = useNavigate()
    return useMutation({
        mutationFn: signUpMutation,
        onSuccess: ()=>{
            toast.success('Signup successful! Redirecting to login...');
            navigate('/auth/sign-in');
        },
        onError: (error: AxiosError<{ message?: string }>)=>{
            toast.error(error.response?.data.message || 'Signup failed');
        }
    })
}