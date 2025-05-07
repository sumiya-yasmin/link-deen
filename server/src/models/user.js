import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
},{timestamps: true});

//hash before save
userSchema.pre('save', async function () {
    if(!this.isModified('password')) return;
    this.password= await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidate) {
   return await bcrypt.compare(candidate, this.password);
    
}
const User = mongoose.model('User', userSchema);
export default User;