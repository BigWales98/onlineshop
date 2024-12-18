import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Post from '@/models/post'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongoDB()
    const post = await Post.findById(params.id)
    
    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('게시글 조회 실패:', error)
    return NextResponse.json(
      { error: '게시글 조회 실패' },
      { status: 500 }
    )
  }
} 