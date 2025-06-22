import API from "@/lib/axios"

export const getProfileById = async(profileId: string) =>{
   const response = await API.get(`/profile/${profileId}`);
   return response.data;
}