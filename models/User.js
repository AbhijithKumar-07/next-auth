import mongoose from "mongoose";
import Email from "next-auth/providers/email";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: false}
}, {timestamps: true})

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;