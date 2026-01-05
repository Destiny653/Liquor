import Gift from "@/models/Gift";
import connectDB from "@/utils/db";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from 'next/server';

// Configuration
cloudinary.config({
    cloud_name: 'dxornm9ex',
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export const GET = async () => {
    try {
        await connectDB();
        const gifts = await Gift.find().sort({ createdAt: -1 });
        return new NextResponse(JSON.stringify(gifts), { status: 200 });
    } catch (error) {
        console.error("GET Gifts Error:", error);
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

export const POST = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const { title, content, price, rate, img, bundleItems, isBestSeller, occasion } = body;

        let imageUrl = img;
        if (img && img.startsWith('data:image')) {
            const uploadResult = await cloudinary.uploader.upload(img, {
                public_id: `gift_${Date.now()}_${title.replace(/\s+/g, '_')}`
            });
            imageUrl = uploadResult.secure_url;
        }

        const newGift = new Gift({
            title,
            content,
            price,
            rate,
            img: imageUrl,
            bundleItems: bundleItems || [],
            isBestSeller: isBestSeller || false,
            occasion: occasion || 'General'
        });

        await newGift.save();
        return new NextResponse(JSON.stringify(newGift), { status: 201 });
    } catch (error) {
        console.error("POST Gift Error:", error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
