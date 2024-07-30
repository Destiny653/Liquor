import User from '@/models/User';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await connectDB();

  const { id } = req.query;

  try {
    const user = await User.findById(id).populate('orders');
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}