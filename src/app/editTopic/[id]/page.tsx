'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image' // next/image 임포트

interface Topic {
  _id: string
  title: string
  description: string
  image?: string
  price: number
  category: string // 카테고리 추가
}

export default function EditTopicPage() {
  const params = useParams() // URL에서 id 가져오기
  const router = useRouter() // 페이지 이동을 위해 사용
  const id = params?.id
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [image, setImage] = useState<File | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImage(file)
  }

  useEffect(() => {
    if (!id) return

    const fetchTopic = async () => {
      try {
        const res = await fetch(`/api/topics/${id}`)
        if (!res.ok) throw new Error('Failed to fetch topic')
        const data = await res.json()
        setTopic(data)
      } catch (error) {
        console.error('Error fetching topic:', error)
        setError('Failed to fetch topic data.')
      } finally {
        setLoading(false)
      }
    }

    fetchTopic()
  }, [id])

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!topic) return

    const formData = new FormData()

    // 이미지가 있는 경우, 이미지를 formData에 추가
    if (image) {
      formData.append('newImage', image)
    }

    // 기존 topic 데이터와 변경된 제목, 설명, 가격을 formData에 추가
    formData.append('title', topic.title)
    formData.append('description', topic.description)
    formData.append('price', topic.price.toString())
    formData.append('category', topic.category) // 카테고리 값 추가

    // 기존 이미지를 삭제하고 새로운 이미지가 있다면 업로드
    if (topic.image) {
      formData.append('oldImage', topic.image.split('/uploads/')[1]) // 파일명만 보내기
    }

    try {
      const res = await fetch(`/api/topics/${id}`, {
        method: 'PUT',
        body: formData,
      })

      if (!res.ok) throw new Error('Failed to update topic')

      alert('상품이 성공적으로 수정되었습니다.')
      router.push('/') // 수정 완료 후 메인 페이지로 이동
    } catch (error) {
      console.error('Error updating topic:', error)
      alert('상품 수정에 실패했습니다.')
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if (!topic) return <p>수정할 상품을 찾을 수 없습니다.</p>

  return (
    <div className="container mx-auto my-8 max-w-4xl px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">상품 수정</h2>
      <form
        onSubmit={handleUpdate}
        encType="multipart/form-data"
        className="border border-gray-300 rounded-lg bg-white shadow-lg p-6"
      >
        {/* 상품 제목 */}
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block mb-2 font-bold text-gray-700 text-sm"
          >
            상품명
          </label>
          <input
            id="title"
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={topic.title}
            onChange={(e) => setTopic({ ...topic, title: e.target.value })}
            required
          />
        </div>

        {/* 상품 설명 */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block mb-2 font-bold text-gray-700 text-sm"
          >
            상품 설명
          </label>
          <textarea
            id="description"
            className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={topic.description}
            onChange={(e) =>
              setTopic({ ...topic, description: e.target.value })
            }
            required
          ></textarea>
        </div>

        {/* 상품 가격 */}
        <div className="mb-6">
          <label
            htmlFor="price"
            className="block mb-2 font-bold text-gray-700 text-sm"
          >
            상품 가격
          </label>
          <input
            id="price"
            type="number"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={topic.price}
            onChange={(e) =>
              setTopic({ ...topic, price: Number(e.target.value) })
            }
            required
          />
        </div>

        {/* 카테고리 선택 */}
        <div className="mb-6">
          <label
            htmlFor="category"
            className="block mb-2 font-bold text-gray-700 text-sm"
          >
            카테고리
          </label>
          <select
            id="category"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={topic.category}
            onChange={(e) => setTopic({ ...topic, category: e.target.value })}
            required
          >
            <option value="가전제품">가전제품</option>
            <option value="문구(완구)">문구(완구)</option>
            <option value="장난감">장난감</option>
            <option value="생필품">생필품</option>
            <option value="가구">가구</option>
            <option value="기타">기타</option>
          </select>
        </div>

        {/* 이미지 업로드 */}
        <div className="mb-6">
          <label
            htmlFor="image"
            className="block mb-2 font-bold text-gray-700 text-sm"
          >
            상품 이미지
          </label>
          <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>
        </div>
        {topic.image && !image && (
          <div className="mt-6 flex flex-col items-center">
            <Image
              src={topic.image}
              alt="Current product"
              width={128}
              height={128}
              className="rounded-lg border border-gray-300"
            />
            <p className="mt-2 text-sm text-gray-600">현재 등록된 이미지</p>
          </div>
        )}

        {/* 수정 버튼 */}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          수정하기
        </button>
      </form>
    </div>
  )
}
