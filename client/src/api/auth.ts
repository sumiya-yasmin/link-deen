import API from "@/lib/axios"

 export const signUpMutation = async(data:{
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
const response = await API.post('/auth/signup', data);
return response.data;
}

export const signInMutation = async(data:{
  email: string;
  password: string;
}) => {
  const response = await API.post('/auth/signin', data);
  return response.data;
}

export const signOutMutation = async() =>{
    return API.post('/auth/signout');
}