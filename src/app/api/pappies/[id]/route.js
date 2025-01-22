import connectDB from "@/utils/db";
import Pappy from "@/models/Pappy";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

//get a product by id
export async function GET(req, { params }) {
    const { id } = params;

    try {
        await connectDB();
        const post = await  Pappy.findById(id)
        return new NextResponse(JSON.stringify(post), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({message:'Error: '+error}), { status: 500 })
    }
}

//update a product
export async function PUT(req, { params }) {
    const { id } = params
    const { title, content, price, img, rate } = await req.json();

    //cloudinary configuration
    cloudinary.config({
        cloud_name: 'dxornm9ex',
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    })
    const uploadResult = await cloudinary.uploader.upload(img, {
        public_id: title
    }).catch((error) => console.log(error));

    try {
        await connectDB();
        await Pappy.findByIdAndUpdate(id, {
            title,
            content,
            price,
            rate,
            img: uploadResult?.secure_url
        });
        return new NextResponse({ message: 'Product Updated' }, { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({message:'Error: '+error}), { status: 500 })
    }
}

//deleting a product by id

export const DELETE = async (req, { params }) => {

    const { id } = params;
    await connectDB();

    try {
        //cloudinary configuration
        cloudinary.config({
            cloud_name: 'dxornm9ex',
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        });
        
        const post = await Pappy.findById(id);
        cloudinary.api.delete_resources([post.title], {
            type: 'upload',
            resource_tube: 'image'
        })
    } catch (error) {
        console.log(error);
        return new NextResponse('Cloudinary Image not deleted', { status: 500 });
    }

    //deleting from databse

    try {
        const post = await Pappy.findByIdAndDelete(id);
        return new NextResponse(JSON.stringify(post), {message: 'Post deleted successfully', status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({message:'Error: '+error}), {status: 500});
    }

}