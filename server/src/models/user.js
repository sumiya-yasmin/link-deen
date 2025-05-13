import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
},{timestamps: true});

//hash before save
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return;
     const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (plainPassword) {
   return await bcrypt.compare(plainPassword, this.password);
    
}
const User = mongoose.model('User', userSchema);
export default User;