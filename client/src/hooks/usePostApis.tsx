import { createPost } from "@/api/posts"
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useCreatePost = () =>{
    const queryClient = useQueryClient();
        const navigate = useNavigate();
    return useMutation({
        mutationFn: createPost,
        onSuccess: ()=>{
            toast.success('Post created successfully');
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_RECENT_POSTS]});
            navigate('/');
        },
        onError: (error: AxiosError<{ message?: string }>)=>{
            toast.error(error.response?.data.message || 'Post creation failed');
        }
    })
}