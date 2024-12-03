'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  _id: string
  title: string
  price: number
  image?: string
}

export default function PopularProductsCarousel({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      )
    }, 3000)

    return () => clearInterval(timer)
  }, [products.length])

  if (!products.length) return null

  return (
    <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
      <div 
        style={{ 
          display: 'flex',
          transition: 'transform 500ms ease-in-out',
          transform: `translateX(-${currentIndex * 100}%)`
        }}
      >
        {products.map((product) => (
          <div key={product._id} style={{ minWidth: '100%', flexShrink: 0 }}>
            <Link href={`/detailTopic/${product._id}`}>
              <div className="flex flex-col items-center p-4">
                <div className="relative w-64 h-64">
                  <Image
                    src={product.image || '/default-avatar.png'}
                    alt={product.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold mt-4">{product.title}</h3>
                <p className="text-lg font-bold text-blue-600">{product.price}원</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}