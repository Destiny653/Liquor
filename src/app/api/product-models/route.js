import ProductModel from "@/models/ProductModel";
import connectDB from "@/utils/db";
import { NextResponse } from 'next/server';

import { v2 as cloudinary } from "cloudinary";

export const GET = async () => {
    try {
        await connectDB();
        const models = await ProductModel.find().sort({ label: 1 });
        return new NextResponse(JSON.stringify(models), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

export const POST = async (req) => {
    try {
        await connectDB();
        const { value, label, description, image } = await req.json();

        cloudinary.config({
            cloud_name: 'dxornm9ex',
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        });

        let imageUrl = image;
        if (image && image.startsWith('data:image')) {
            const uploadResult = await cloudinary.uploader.upload(image, {
                public_id: `brand_${value}_${Date.now()}`
            });
            imageUrl = uploadResult.secure_url;
        }

        const newModel = new ProductModel({ value, label, description, image: imageUrl });
        await newModel.save();
        return new NextResponse(JSON.stringify(newModel), { status: 201 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
