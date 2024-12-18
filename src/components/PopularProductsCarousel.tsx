'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import Link from 'next/link'

interface Product {
  _id: string
  title: string
  price: number
  image?: string
}

interface PopularProductsCarouselProps {
  products: Product[]
}

export default function PopularProductsCarousel({ products: initialProducts }: PopularProductsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout>()

  // 자동 슬라이드
  useEffect(() => {
    const autoPlay = () => {
      if (initialProducts.length > 1 && !isPaused) {
        setCurrentIndex((current) =>
          current === initialProducts.length - 1 ? 0 : current + 1
        )
      }
    }

    autoPlayRef.current = setInterval(autoPlay, 3000)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [initialProducts.length, isPaused])

  const nextSlide = () => {
    if (initialProducts.length > 1) {
      setCurrentIndex((current) =>
        current === initialProducts.length - 1 ? 0 : current + 1
      )
    }
  }

  const prevSlide = () => {
    if (initialProducts.length > 1) {
      setCurrentIndex((current) =>
        current === 0 ? initialProducts.length - 1 : current - 1
      )
    }
  }

  if (initialProducts.length === 0) {
    return null
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div 
        className="overflow-hidden rounded-lg"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {isPaused && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm z-10">
            일시정지됨
          </div>
        )}
        
        <div className="relative h-[300px]">
          {initialProducts.map((product, index) => (
            <Link
              key={product._id}
              href={`/detailTopic/${product._id}`}
              className={`absolute w-full h-full transition-opacity duration-500 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={product.image || '/default-product.png'}
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
                  <h3 className="text-lg font-bold mb-1">{product.title}</h3>
                  <p className="text-base">{product.price.toLocaleString()}원</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {initialProducts.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            >
              <IoChevronBack size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            >
              <IoChevronForward size={24} />
            </button>
          </>
        )}

        {initialProducts.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {initialProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index
                    ? 'bg-white w-4'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}