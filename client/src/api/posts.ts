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

export const updatePost = async({postId, formData}:{postId: string; formData: FormData;}) =>{
  const response = await API.put(`/post/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export const deletePost = async(postId : string)=>{
  return await API.delete(`/post/${postId}`);
}

export  const getPostById = async(postId: string) =>{
  const response= await API.get(`/post/${postId}`);
  return response.data;
}

export const getPopularPosts = async({ pageParam = null, timeframe = 'today' }) =>{
  const res= await API.get('/post/popular', {
    params: {
      cursor: pageParam,
      limit: 10,
      timeframe,
    },
});
  return res.data;
}

export const getSearchedPosts = async({query, pageParam =null}:{query: string, pageParam?: string | null}) =>{
  const response = await API.get('/post/search', {
    params:{
      query,
      cursor: pageParam,
      limit: 10,
    },
  });
  return response.data;
}