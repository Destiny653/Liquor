import User from "@/models/User";
import connectDB from "@/utils/db";
import bcrypt from 'bcryptjs';
import { NextResponse } from "next/server";

 export const POST = async(req, res)=>{
    await connectDB()
    if (req.method !== 'POST') {
        return  NextResponse.json({success: false, message: `Method ${req.method} not allowed`}, {status: 405});
    }  
        const { username, email, password } = await req.json();

        try {
            const existUser = await User.findOne({ email });
            if (existUser) {
                return  NextResponse.json({ success: false, message: 'User already exists'}, {status: 400});
            }
            const hashedpassword = await bcrypt.hash(password, 5)
            const newUser = new User({
                name: username,
                email,
                password: hashedpassword
            })
            console.log(newUser);
            await newUser.save();
            return  NextResponse.json({success:true, message: 'User created successfully', user: newUser}, {status: 201});
            
        } catch (error) {
            return  NextResponse.json({ success: false, message: 'Internal server error'}, {status: 500});
        }
};
