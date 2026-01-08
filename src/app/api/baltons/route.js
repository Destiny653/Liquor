import Balton from "@/models/Balton";
import connectDB from "@/utils/db";
import { v2 as cloudinary } from "cloudinary"
import { NextResponse } from 'next/server';


//get all posts from the database

export const GET = async () => {
    try {
        // connect to database
        await connectDB();
        // find all the psts in the database
        const posts = await Balton.find().sort({ createdAt: -1 })
        //return the posts as a json when successful
        return new NextResponse(JSON.stringify(posts), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}


export const POST = async (req) => {

    await connectDB();

    const { title, content, price, rate, img } = await req.json();


    // Configuration

    cloudinary.config({
        cloud_name: 'dxornm9ex',
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });

    const uploadResult = await cloudinary.uploader.upload(img, {
        public_id: title
    }).catch((error) => { });

    try {
        const newPost = new Balton({
            title,
            content,
            price,
            rate,
            img: uploadResult?.secure_url
        });
        await newPost.save();
        return new NextResponse(JSON.stringify(newPost), { status: 201 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}