import Order from "@/models/Order";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';


//get all posts from the database

export const GET = async () => {
    try {
        // connect to database
        await connectDB();

        // find all the psts in the database
        const posts = await Order.find().sort({ createdAt: -1})
        console.log(posts);

        //return the posts as a json when successful
        return new NextResponse(JSON.stringify(posts), { status: 200 });
    } catch (error) {
        console.log(error);

        // if there is an error, return a 500 status code
        return new NextResponse('Database Error', { status: 500 });
    }
}


export const POST = async (req) => {

    const { title, img, content, price, useremail, firstname, lastname } = await req.json();
    //Configuring Cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });
    
    const uploadResult = await cloudinary.uploader.upload(img, {
        public_id: title
    }).catch((error) => console.log(error));
    console.log('after:', uploadResult?.secure_url);

    // Connect to mongo database
    await connectDB();
    try {
        const post = new Order({
            title,
            description,
            img: uploadResult?.secure_url,
            content,
            firstname,
            lastname,
            useremail,
            price
        });

        await post.save();
        return new NextResponse(JSON.stringify(post), { status: 201 });
    } catch (error) {
        console.log(error);

        // if there is an error, return a 500 status code
        return new NextResponse('Database Error', { status: 500 });
    }
}