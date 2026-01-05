import bcrypt from "bcryptjs"
import connectDB from "@/utils/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const POST = async (req, res, next) => {
    //get email and password
    const { email, password } = await req.json();
    //connect to database
    connectDB()
    // check if user exists
    try {
        const isUser = await User.findOne({ email: email });
        if (isUser) {
            const isUserPassword = isUser.password;
            const isUserPasswordMatch = bcrypt.compareSync(password, isUserPassword);
            if (isUserPasswordMatch) {
                return new NextResponse(JSON.stringify({ userData: isUser, message: 'Succesfully logged in' }), { status: 201 });
            } else {
                return new NextResponse(JSON.stringify({ message: "Your password is incorrect, try using another account." }), { status: 404 })
            }
        } else {
            return new NextResponse(JSON.stringify({ message: "User with email: " + email + " does't exist." }), { status: 404 })
        }
    } catch (e) {
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }

}