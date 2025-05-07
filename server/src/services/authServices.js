import User from "../models/user.js"

export const createUser = async(userData)=>{
    const user = new User(userData);
    await user.save();
    return user;
}