import ProductModel from "@/models/ProductModel";
import connectDB from "@/utils/db";
import { NextResponse } from 'next/server';

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
        const newModel = new ProductModel({ value, label, description, image });
        await newModel.save();
        return new NextResponse(JSON.stringify(newModel), { status: 201 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
