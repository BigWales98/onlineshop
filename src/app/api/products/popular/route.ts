import { NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Product from '@/models/product'

export async function GET() {
  try {
    await connectMongoDB()
    // 예시: 조회수나 판매량 기준으로 인기상품 4개 조회
    const products = await Product.find()
      .sort({ views: -1 })  // 또는 다른 인기도 기준
      .limit(4)
    
    return NextResponse.json({ products })
  } catch (error) {
    console.error('인기 상품 조회 실패:', error)
    return NextResponse.json(
      { error: '인기 상품 조회 실패' },
      { status: 500 }
    )
  }
} 