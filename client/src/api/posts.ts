import API from '@/lib/axios';

export const createPost = async (formData: FormData) => {
  const response = await API.post('/post', formData
    , {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
);
  return response.data;
};

export const getRecentPosts = async({pageParam = null})=>{
  const response = await API.get('/post/recent', {
    params: {
       cursor: pageParam,
      limit: 10,
    },
  });
  return response.data;
}

export const likePost = async(postId : string) =>{
  const response = await API.post(`/post/${postId}/like`);
  return response.data;
}

export const deletePost = async(postId : string)=>{
  return await API.delete(`/post/${postId}`);
}