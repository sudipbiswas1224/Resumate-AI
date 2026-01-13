import bcrypt from 'bcrypt'
import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import resumeModel from '../models/resume.model.js';


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
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        // create a new user
        const hashPassword = await bcrypt.hash(password, 10);
            const newUser = await userModel.create({
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

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        //check if user exists
        const user = await userModel.findOne({ email });
        console.log(user);

        if (!user) {
            return res.status(404).json({
                message: 'Invalid user or password'
            })
        }

        // check the password is correct
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
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

// controller for getting user by id 
// GET: /api/users/data
export const getUserById = async (req, res)=>{
    try{
        const userId = req.userId;
        // check if user exists or not 
        const user = await userModel.findById(userId);

        if(!user) return res.status(404).json({
            message: "User not found"
        })

        // return user
        user.password = undefined;
        res.status(200).json({
            user
        })
    }catch(error){
        return res.status(400).json({
            message : error.message
        })
    }
}

// controller for getting userresume
// GET: /api/users/resumes
export const getUserResumes = async (req,res)=>{
    try {
        const userId = req.userId;

        const resumes = await resumeModel.find({userId});
        return res.status(200).json({
            resumes
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}