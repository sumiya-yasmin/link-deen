import User from "../models/user.js"

export const getUserProfileById = (id) =>{
    const profile = User.findById(id).select('-password -refreshToken');
    if(!profile){
        throw new Error('User not found')
    }
    return profile;
}