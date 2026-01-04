import User from "@/models/User";
import connectDB from "@/utils/db";
import bcrypt from 'bcryptjs';
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
    await connectDB()
    if (req.method !== 'POST') {
        return NextResponse.json({ success: false, message: `Method ${req.method} not allowed` }, { status: 405 });
    }
    const { name, email, password } = await req.json();
    console.log('signup credentials: ' + name, email, password);


    try {
        const existUser = await User.findOne({ email });
        if (existUser) {
            console.log('User already exists please try using another account.');
            return NextResponse.json({ error: true, success: false, message: 'User already exists please try using another account.' }, { status: 400 });
        }
        const hashedpassword = await bcrypt.hash(password, 5)
        const newUser = new User({
            name: name,
            email,
            password: hashedpassword,
            provider: 'credentials'
        })
        console.log(newUser);
        await newUser.save();
        return NextResponse.json({ success: true, message: 'User created successfully', user: newUser }, { status: 201 });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error: ' + error.message }, { status: 500 });
    }
};

export const GET = async (req, res) => {
    await connectDB()
    try {
        const users = await User.find();
        console.log(users);

        if (!users) {
            return NextResponse.json({ success: false, message: 'No users found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, users }, { status: 200 });
    } catch (error) {
        return NextResponse.json(JSON.stringify({ message: 'Error: ' + error }), { status: 500 });
    }
}
