import { createPost } from "@/api/posts"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useCreatePost = () =>{
        const navigate = useNavigate()
    return useMutation({
        mutationFn: createPost,
        onSuccess: ()=>{
            toast.success('Post created successfully');
            navigate('/');
        },
        onError: (error: AxiosError<{ message?: string }>)=>{
            toast.error(error.response?.data.message || 'Post creation failed');
        }
    })
}