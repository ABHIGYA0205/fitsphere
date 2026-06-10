import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
    });
    return NextResponse.json(favorites.map(f => f.videoId));
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const { videoId } = await request.json();

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_videoId: {
          userId: session.user.id,
          videoId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ added: false });
    } else {
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          videoId,
        },
      });
      return NextResponse.json({ added: true });
    }
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
