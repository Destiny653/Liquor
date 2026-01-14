import Product from "@/models/Product";
import connectDB from "@/utils/db";
import { NextResponse } from 'next/server';

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        await connectDB();
        const product = await Product.findById(id);
        if (!product) {
            return new NextResponse(JSON.stringify({ message: 'Product not found' }), { status: 404 });
        }
        return new NextResponse(JSON.stringify(product), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

export const PUT = async (req, { params }) => {
    const { id } = params;
    try {
        await connectDB();
        const data = await req.json();

        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

        if (!updatedProduct) {
            return new NextResponse(JSON.stringify({ message: 'Product not found' }), { status: 404 });
        }
        return new NextResponse(JSON.stringify(updatedProduct), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

export const DELETE = async (req, { params }) => {
    const { id } = params;
    try {
        await connectDB();
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return new NextResponse(JSON.stringify({ message: 'Product not found' }), { status: 404 });
        }
        return new NextResponse(JSON.stringify({ message: 'Product deleted successfully' }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
