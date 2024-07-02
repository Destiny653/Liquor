import connectDB from "@/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export const POST = async (req, res) => {
    const { name, email, password}  = await req.json(); 

       // connect to database
       await connectDB();

       //check if user exist

    try{
       const user = await User.findOne({email})
       if(user){
           return new NextResponse(JSON.stringify({message: "User already exist"}),{status: 400});
       }
    }catch(err){
        console.log(err);
        return new NextResponse(JSON.stringify(err),{status: 500});
    }

    // create a new user
    try {
        // hash the password
        const hashedPassword = bcrypt.hashSync(password,5)
        // valdate our user to the user model we built
        const newUser =  new User({ name: name,  email, password: hashedPassword})
        // save the user and his information to the database
        await newUser.save();
        //return a response to the apo agter creating the new user
        return new NextResponse(JSON.stringify(newUser),{status: 201});
    } catch (err) {
        console.log(err);
        return new NextResponse(JSON.stringify(err),{status: 500});
    }
}