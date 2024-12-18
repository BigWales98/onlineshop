'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiSearch } from 'react-icons/fi'

interface Topic {
  _id: string
  title: string
  description: string
  price: number
  image?: string
  category: string
  createdAt: string
}

export default function TopicLists() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('latest')
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const categories = ['전체', '가전제품', '문구(완구)', '장난감', '생필품', '가구', '기타']

  const sortOptions = {
    date: [
      { value: 'latest', label: '최신순' },
      { value: 'oldest', label: '오래된순' },
    ],
    price: [
      { value: 'priceHigh', label: '높은 가격순' },
      { value: 'priceLow', label: '낮은 가격순' },
    ],
  }

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch('/api/topics')
        if (!res.ok) throw new Error('Failed to fetch topics')
        const data = await res.json()
        setTopics(data.topics)
        setFilteredTopics(data.topics)
      } catch (error) {
        console.error('Error loading topics: ', error)
        setError('Failed to load topics')
      } finally {
        setLoading(false)
      }
    }
    fetchTopics()
  }, [])

  useEffect(() => {
    let result = [...topics]

    if (selectedCategory !== '전체') {
      result = result.filter(topic => topic.category === selectedCategory)
    }

    if (searchTerm) {
      result = result.filter(topic =>
        topic.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    switch (sortOption) {
      case 'latest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'priceHigh':
        result.sort((a, b) => b.price - a.price)
        break
      case 'priceLow':
        result.sort((a, b) => a.price - b.price)
        break
    }

    setFilteredTopics(result)
  }, [topics, searchTerm, sortOption, selectedCategory])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="container mx-auto my-8">
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="flex flex-col gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="상품명 검색..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 max-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 max-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">날짜순:</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.date.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 max-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">가격순:</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.price.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Image src="/loading.gif" alt="Loading" width={200} height={200} />
        </div>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTopics.map((topic) => (
            <div key={topic._id} className="border p-4 rounded-lg hover:shadow-lg transition-shadow">
              <Link href={`/detailTopic/${topic._id}`}>
                <div className="relative h-48 mb-2">
                  <Image
                    src={topic.image || '/default-avatar.png'}
                    alt={topic.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-semibold truncate">{topic.title}</h3>
                <p className="text-blue-600">{topic.price.toLocaleString()}원</p>
                <p className="text-sm text-gray-500">{topic.category}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}