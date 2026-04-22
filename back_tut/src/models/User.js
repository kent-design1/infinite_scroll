import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String,
        required: [true, "Please enter a name"],
        trim: true },

    email: { type: String,
        unique: true,
        required: [true, "Please enter a valid email address"],
        trim: true,
        lowercase: true },

    password: { type: String,
        required: [true, "Please enter a valid password"],
        minlength: 6 },

})

const User = mongoose.model("User", UserSchema);