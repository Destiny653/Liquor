import ProductModel from "@/models/ProductModel";
import connectDB from "@/utils/db";
import { NextResponse } from 'next/server';

import { v2 as cloudinary } from "cloudinary";

export const GET = async (req, { params }) => {
    const { id } = await params;
    try {
        await connectDB();
        const model = await ProductModel.findById(id);
        if (!model) return new NextResponse(JSON.stringify({ message: 'Model not found' }), { status: 404 });
        return new NextResponse(JSON.stringify(model), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

export const PUT = async (req, { params }) => {
    const { id } = await params;
    try {
        await connectDB();
        const data = await req.json();
        const { value, label, description, image } = data;

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

        const updated = await ProductModel.findByIdAndUpdate(id, {
            value,
            label,
            description,
            image: imageUrl
        }, { new: true });

        return new NextResponse(JSON.stringify(updated), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
    }
}

export const DELETE = async (req, { params }) => {
    const { id } = await params;
    try {
        await connectDB();
        await ProductModel.findByIdAndDelete(id);
        return new NextResponse(JSON.stringify({ message: 'Model deleted' }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
