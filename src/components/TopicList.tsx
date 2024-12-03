'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Topic {
  _id: string
  title: string
  description: string
  price: number
  image?: string
  category: string
}

export default function TopicLists() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch('/api/topics')
        if (!res.ok) {
          throw new Error('Failed to fetch topics')
        }
        const data = await res.json()
        setTopics(data.topics)
      } catch (error) {
        console.error('Error loading topics: ', error)
        setError('Failed to load topics')
      } finally {
        setLoading(false)
      }
    }
    fetchTopics()
  }, [])

  return (
    <div className="container mx-auto my-8">
      {/* 상품 목록 */}
      {loading ? (
        <div className="flex justify-center">
          <Image src="/loading.gif" alt="Loading" width={200} height={200} />
        </div>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topics.map((topic) => (
            <div key={topic._id} className="border p-4 rounded-lg">
              <Link href={`/detailTopic/${topic._id}`}>
                <div className="relative h-48 mb-2">
                  <Image
                    src={topic.image || '/default-avatar.png'}
                    alt={topic.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-semibold">{topic.title}</h3>
                <p className="text-blue-600">{topic.price}원</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}