import Product from "@/models/Product";
import connectDB from "@/utils/db";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from 'next/server';

export const GET = async (req) => {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const model = searchParams.get('model');
        const occasion = searchParams.get('occasion');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        const query = {};
        if (model && model !== 'all') {
            query.productModel = model;
        }
        if (occasion && occasion !== 'all') {
            query.occasion = occasion;
        }

        const [products, total] = await Promise.all([
            Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Product.countDocuments(query)
        ]);

        return new NextResponse(JSON.stringify({
            products,
            total,
            page,
            pages: Math.ceil(total / limit)
        }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
    }
}

export const POST = async (req) => {
    try {
        await connectDB();
        const data = await req.json();
        const { title, content, price, rate, img, productModel, occasion } = data;

        cloudinary.config({
            cloud_name: 'dxornm9ex',
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        });

        let imageUrl = img;
        if (img && img.startsWith('data:image')) {
            const uploadResult = await cloudinary.uploader.upload(img, {
                public_id: title.replace(/\s+/g, '_').toLowerCase() + "_" + Date.now()
            });
            imageUrl = uploadResult.secure_url;
        }

        const newProduct = new Product({
            title,
            content,
            price: parseFloat(price),
            rate: parseInt(rate) || 0,
            img: imageUrl,
            productModel,
            occasion
        });

        await newProduct.save();
        return new NextResponse(JSON.stringify(newProduct), { status: 201 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
