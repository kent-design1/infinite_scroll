import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userID) => {
    return jwt.sign({
        id: userID, },
        process.env.JWT_SECRET,
            {expiresIn: "7d"})
}


const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    try{
        // 1. Check all fields were sent
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Missing required field" });
        }
        // 2. Check if a user with that email already exists
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({ error: "Email already exists" });
        }
        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // 4. Create the user in MongoDB
        const user = await User.create({
            name,
            email,
            password: hash,
        })

        // 5. Send back the new user (minus the password)
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            token: generateToken(user._id),
        });

    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
    if (!email || !password) {
    return res.status(400).json({ error: "Missing required field" });}

    const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if(!passwordMatch){
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}

export {registerUser}
export {loginUser}