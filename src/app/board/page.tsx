'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'

interface Post {
  _id: string;
  title: string;
  content: string;
  userEmail: string;
  createdAt: string;
  comments: Comment[];
}

export default function BoardPage() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      setPosts(data.posts)
    } catch (error) {
      console.error('게시글 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">자유게시판</h1>
        {session && (
          <Link href="/board/write" 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FiPlus /> 글쓰기
          </Link>
        )}
      </div>

      {loading ? (
        <div>로딩 중...</div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          {posts.map((post) => (
            <Link href={`/board/${post._id}`} key={post._id}>
              <div className="border-b p-4 hover:bg-gray-50 transition-colors">
                <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{post.userEmail}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 