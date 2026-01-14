import ProductModel from "@/models/ProductModel";
import connectDB from "@/utils/db";
import { NextResponse } from 'next/server';

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
        const updated = await ProductModel.findByIdAndUpdate(id, data, { new: true });
        return new NextResponse(JSON.stringify(updated), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
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
