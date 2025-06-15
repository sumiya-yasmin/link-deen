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
