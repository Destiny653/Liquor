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

export const GET = async (req, { params }) => {
    const { id } = await params;
    try {
        await connectDB();
        const gift = await Gift.findById(id);
        if (!gift) return new NextResponse(JSON.stringify({ message: "Gift not found" }), { status: 404 });
        return new NextResponse(JSON.stringify(gift), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

export const PUT = async (req, { params }) => {
    const { id } = await params;
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

        const updatedGift = await Gift.findByIdAndUpdate(
            id,
            { title, content, price, rate, img: imageUrl, bundleItems, isBestSeller, occasion },
            { new: true }
        );

        if (!updatedGift) return new NextResponse(JSON.stringify({ message: "Gift not found" }), { status: 404 });
        return new NextResponse(JSON.stringify(updatedGift), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export const DELETE = async (req, { params }) => {
    const { id } = await params;
    try {
        await connectDB();
        const deletedGift = await Gift.findByIdAndDelete(id);
        if (!deletedGift) return new NextResponse(JSON.stringify({ message: "Gift not found" }), { status: 404 });
        return new NextResponse(JSON.stringify({ message: "Gift deleted successfully" }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
