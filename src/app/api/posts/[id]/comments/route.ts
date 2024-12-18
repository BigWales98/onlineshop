import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Post from '@/models/post'
import mongoose from 'mongoose'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongoDB()
    const { content, userEmail, parentId } = await request.json()

    const post = await Post.findById(params.id)
    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    const newComment = {
      content,
      userEmail,
      createdAt: new Date(),
      ...(parentId && { parentId }),
      _id: new mongoose.Types.ObjectId()
    }

    post.comments.push(newComment)
    await post.save()

    return NextResponse.json({ comment: newComment }, { status: 201 })
  } catch (error) {
    console.error('댓글 작성 실패:', error)
    return NextResponse.json(
      { error: '댓글 작성 실패' },
      { status: 500 }
    )
  }
}