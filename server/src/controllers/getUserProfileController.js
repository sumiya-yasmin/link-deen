import { getAuthenticatedUserProfileById } from "../services/getUserProfileServices.js";


export const getAuthenticatedUserProfile = async (req, res) => {
  const id = req._id;
  try {
    const profile = await getAuthenticatedUserProfileById(id);
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      _id: profile._id,
      name: profile.name,
      email: profile.email,
      username: profile.username,
      imageUrl: profile.imageUrl || '/assets/profile-placeholder.png'
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getUserProfileById = async(req,res) =>{
  
}