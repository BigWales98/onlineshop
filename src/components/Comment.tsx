'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export interface CommentProps {
  _id: string
  content: string
  userEmail: string
  createdAt: string
  depth?: number
  onReply: (parentId: string, content: string) => void
  onDelete: (commentId: string) => void
  replies?: CommentProps[]
  isLastReply?: boolean
  onEdit: (commentId: string, content: string) => void
}

export default function Comment({
  _id,
  content,
  userEmail,
  createdAt,
  depth = 0,
  onReply,
  onDelete,
  replies,
  isLastReply = false,
  onEdit
}: CommentProps) {
  const { data: session } = useSession()
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)

  const isAuthor = session?.user?.email === userEmail

  const handleDelete = async () => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      onDelete(_id)
    }
  }

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (replyContent.trim()) {
      onReply(_id, replyContent)
      setReplyContent('')
      setIsReplying(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editContent.trim() && editContent !== content) {
      await onEdit(_id, editContent)
      setIsEditing(false)
    }
  }

  return (
    <div className={`relative ${depth > 0 ? 'ml-8' : ''} mb-4`}>
      {depth > 0 && (
        <div className="absolute -left-6 top-0 h-full">
          <div className="absolute left-0 -top-4 h-8 w-6 border-l-2 border-b-2 border-gray-300 rounded-bl-xl" />
          {!isLastReply && (
            <div className="absolute left-0 top-4 h-[calc(100%-2rem)] w-0 border-l-2 border-gray-300" />
          )}
        </div>
      )}
      <div className="bg-gray-50 p-4 rounded-lg relative z-10">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">{userEmail}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {new Date(createdAt).toLocaleDateString()}
            </span>
            {isAuthor && (
              <>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-500 text-sm hover:text-blue-600"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 text-sm hover:text-red-600"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>
        {isEditing ? (
          <form onSubmit={handleEdit}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border rounded-lg mb-2"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setEditContent(content)
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                수정하기
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-700">{content}</p>
        )}
        {session && (
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="text-blue-500 text-sm mt-2"
          >
            답글달기
          </button>
        )}
      </div>

      {isReplying && (
        <div className="mt-2 ml-8">
          <form onSubmit={handleReplySubmit} className="mt-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="답글을 입력하세요..."
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                답글 작성
              </button>
            </div>
          </form>
        </div>
      )}

      {replies && replies.length > 0 && (
        <div className="mt-2">
          {replies.map((reply, index) => (
            <Comment
              key={reply._id}
              {...reply}
              depth={depth + 1}
              onReply={onReply}
              onDelete={onDelete}
              replies={reply.replies}
              isLastReply={index === replies.length - 1}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
} 