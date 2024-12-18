import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Post from '@/models/post'

export async function GET() {
  try {
    await connectMongoDB()
    const posts = await Post.find().sort({ createdAt: -1 })
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('게시글 로딩 실패:', error)
    return NextResponse.json(
      { error: '게시글 로딩 실패' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, userEmail } = await request.json()
    await connectMongoDB()
    const post = await Post.create({
      title,
      content,
      userEmail,
      createdAt: new Date()
    })
    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('게시글 작성 실패:', error)
    return NextResponse.json(
      { error: '게시글 작성 실패' },
      { status: 500 }
    )
  }
} 