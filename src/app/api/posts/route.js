import Post from '@/models/Post';
import connectDB from "@/utils/db";
import {v2 as cloudinary} from "cloudinary"
import { NextResponse } from 'next/server';

 
//get all posts from the database

export const GET = async () => {
    try {
        // connect to database
        await connectDB();
        // find all the psts in the database
        const posts = await Post.find().sort({ createdAt: -1})
        console.log(posts);
        //return the posts as a json when successful
        return new NextResponse(JSON.stringify(posts), { status: 200 });
    } catch (error) {
        console.log(error);
        // if there is an error, return a 500 status code
        return new NextResponse(JSON.stringify({message:'Error: '+error}), { status: 500 });
    }
}


export const POST = async (req)=>{
    
    await connectDB();

    const {title, content, price, rate, img} = await req.json();

    
    // Configuration
    
    cloudinary.config({ 
        cloud_name: 'dxornm9ex', 
        api_key:process.env.API_KEY, 
        api_secret:process.env.API_SECRET
    });

    const uploadResult = await cloudinary.uploader.upload(img,{
        public_id: title
    }).catch((error)=> console.log(error));

    try{
        const newPost = new Post({
            title,
            content,
            price,
            rate,
            img: uploadResult?.secure_url
        });
        console.log('post succesful')
        await newPost.save();
        return new NextResponse(JSON.stringify(newPost), {status: 201});
    }catch(error){
        return new NextResponse(JSON.stringify({error: error.message}), {status: 500});
    }
}