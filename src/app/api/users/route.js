import User from "@/models/User";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async (req) => {
    await connectDB();
    try {
        // Exclude password from the result
        const users = await User.find({}, '-password').sort({ createdAt: -1 });

        return NextResponse.json({ success: true, users }, { status: 200 });
    } catch (err) {
        console.error("Error fetching users:", err);
        return NextResponse.json({ success: false, message: "Failed to fetch users" }, { status: 500 });
    }
};
