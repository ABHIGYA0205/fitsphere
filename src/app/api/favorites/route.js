import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import Favorite from '@/models/Favorite';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Unauthorized', { status: 401 });

  try {
    await connectToDatabase();
    
    // session.user.id or email
    let userId = session.user?.id;
    if (!userId) {
      // fallback if id wasn't mapped in token
      const User = require('@/models/User').default;
      const user = await User.findOne({ email: session.user.email });
      userId = user?._id;
    }

    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const favorites = await Favorite.find({ userId });
    return NextResponse.json(favorites.map(f => f.videoId));
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const { videoId } = await request.json();
    if (!videoId) return new NextResponse('Video ID missing', { status: 400 });

    await connectToDatabase();

    let userId = session.user?.id;
    if (!userId) {
      const User = require('@/models/User').default;
      const user = await User.findOne({ email: session.user.email });
      userId = user?._id;
    }

    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const existing = await Favorite.findOne({ userId, videoId });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return NextResponse.json({ added: false });
    } else {
      await Favorite.create({ userId, videoId });
      return NextResponse.json({ added: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
