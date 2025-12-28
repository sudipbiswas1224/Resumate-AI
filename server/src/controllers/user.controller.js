import bcrypt from 'bcrypt'
import User from "../models/user.model";
import userModel from '../models/user.model';
import jwt from 'jsonwebtoken'

// generate token 
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}


// controller for user registration
// POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if required fields are present or not 
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "'Missing required fields"
            })
        }

        // check if user already exists or not
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        // create a new user
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = userModel.create({
            name, email, password: hashPassword
        })

        // return success message
        const token = generateToken(newUser._id);
        newUser.password = undefined;

        return res.status(201).json({
            message: "User created successfully",
            token, user: newUser
        })
    } catch (error) {
        console.error("Create User Error:", error);
        return res.status(500).json({
            message: "Server error",
        })
    }
}

// controller for user login
// POST: /api/users/login

export default loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        //check if user exists
        const user = userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'Invalid user or password'
            })
        }

        // check the password is correct
        if (!user.comparePassword(password)) {
            return res.status(404).json({
                message: 'Invalid user or password'
            })
        }

        // return success message 
        const token = generateToken(user._id);
        user.password = undefined;

        return res.status(200).json({
            message: "Login Successfull",
            token, user
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}