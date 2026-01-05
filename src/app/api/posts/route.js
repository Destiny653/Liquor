import Post from '@/models/Post';
import Balton from '@/models/Balton';
import Buffalo from '@/models/Buffalo';
import Pappy from '@/models/Pappy';
import Penelope from '@/models/Penelope';
import Weller from '@/models/Weller';
import Yamazaki from '@/models/Yamazaki';
import Gift from '@/models/Gift';
import connectDB from "@/utils/db";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from 'next/server';

export const GET = async () => {
    try {
        await connectDB();

        // Fetch all products from all collections
        const [posts, baltons, buffalos, pappies, penelopes, wellers, yamazakis, gifts] = await Promise.all([
            Post.find(),
            Balton.find(),
            Buffalo.find(),
            Pappy.find(),
            Penelope.find(),
            Weller.find(),
            Yamazaki.find(),
            Gift.find()
        ]);

        // Combine and sort by createdAt
        const allProducts = [
            ...posts, ...baltons, ...buffalos, ...pappies,
            ...penelopes, ...wellers, ...yamazakis, ...gifts
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return new NextResponse(JSON.stringify(allProducts), { status: 200 });
    } catch (error) {
        console.error("GET All Products Error:", error);
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

export const POST = async (req) => {
    await connectDB();
    const { title, content, price, rate, img } = await req.json();

    cloudinary.config({
        cloud_name: 'dxornm9ex',
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });

    try {
        let imageUrl = img;
        if (img && img.startsWith('data:image')) {
            const uploadResult = await cloudinary.uploader.upload(img, {
                public_id: `post_${Date.now()}_${title.replace(/\s+/g, '_')}`
            });
            imageUrl = uploadResult.secure_url;
        }

        const newPost = new Post({
            title,
            content,
            price,
            rate,
            img: imageUrl
        });
        await newPost.save();
        return new NextResponse(JSON.stringify(newPost), { status: 201 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}