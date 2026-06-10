import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectToDatabase();
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return new NextResponse('Missing info', { status: 400 });
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return new NextResponse('User already exists', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ id: user._id, email: user.email, name: user.name });
  } catch (error) {
    console.error('Signup error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
