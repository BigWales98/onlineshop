'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Comment, { CommentProps } from '@/components/Comment'

interface Post {
  _id: string
  title: string
  content: string
  userEmail: string
  createdAt: string
  comments: CommentType[]
}

interface CommentType {
  _id: string
  content: string
  userEmail: string
  createdAt: string
  parentId?: string
}

export default function PostDetail({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [commentContent, setCommentContent] = useState('')

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}`)
      if (!res.ok) throw new Error('게시글을 찾을 수 없습니다')
      const data = await res.json()
      setPost(data.post)
    } catch (error) {
      console.error('게시글 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.email || !commentContent.trim()) return

    try {
      const res = await fetch(`/api/posts/${params.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentContent,
          userEmail: session.user.email,
        }),
      })

      if (res.ok) {
        setCommentContent('')
        fetchPost() // 댓글 추가 후 게시글 새로고침
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error)
    }
  }

  const handleReply = async (parentId: string, content: string) => {
    if (!session?.user?.email) return

    try {
      const res = await fetch(`/api/posts/${params.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          userEmail: session.user.email,
          parentId,
        }),
      })

      if (res.ok) {
        fetchPost() // 답글 추가 후 게시글 새로고침
      }
    } catch (error) {
      console.error('답글 작성 실패:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/posts/${params.id}/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchPost() // 댓글 삭제 후 게시글 새로고침
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error)
    }
  }

  const handleEditComment = async (commentId: string, content: string) => {
    try {
      const res = await fetch(`/api/posts/${params.id}/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (res.ok) {
        fetchPost() // 댓글 수정 후 게시글 새로고침
      }
    } catch (error) {
      console.error('댓글 수정 실패:', error)
    }
  }

  // 댓글 트리를 구성하는 함수 추가
  const getCommentReplies = (commentId: string): CommentProps[] => {
    if (!post) return []
    
    return post.comments
      .filter(reply => reply.parentId === commentId)
      .map(reply => ({
        ...reply,
        onReply: handleReply,
        onDelete: handleDeleteComment,
        onEdit: handleEditComment,
        replies: getCommentReplies(reply._id.toString())
      }))
  }

  if (loading) return <div className="container mx-auto my-8 px-4">로딩 중...</div>
  if (!post) return <div className="container mx-auto my-8 px-4">게시글을 찾을 수 없습니다</div>

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>{post.userEmail}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="whitespace-pre-wrap mb-8">{post.content}</p>

        {/* 댓글 작성 폼 */}
        {session && (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full p-2 border rounded-lg mb-2"
              placeholder="댓글을 입력하세요..."
              rows={3}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                댓글 작성
              </button>
            </div>
          </form>
        )}

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {post.comments
            .filter(comment => !comment.parentId)
            .map(comment => (
              <Comment
                key={comment._id}
                {...comment}
                depth={0}
                onReply={handleReply}
                onDelete={handleDeleteComment}
                onEdit={handleEditComment}
                replies={getCommentReplies(comment._id.toString())}
              />
            ))}
        </div>
      </div>
    </div>
  )
} 