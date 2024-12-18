import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Post from '@/models/post'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
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

    // 댓글과 관련된 모든 대댓글도 함께 삭제
    post.comments = post.comments.filter(
      comment => comment._id.toString() !== params.commentId &&
                comment.parentId !== params.commentId
    )
    
    await post.save()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('댓글 삭제 실패:', error)
    return NextResponse.json(
      { error: '댓글 삭제 실패' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    await connectMongoDB()
    const { content } = await request.json()
    const post = await Post.findById(params.id)
    
    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    const comment = post.comments.find(
      comment => comment._id.toString() === params.commentId
    )

    if (!comment) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    comment.content = content
    await post.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('댓글 수정 실패:', error)
    return NextResponse.json(
      { error: '댓글 수정 실패' },
      { status: 500 }
    )
  }
} 