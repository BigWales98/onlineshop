import mongoose, { Schema, Model } from 'mongoose'

interface IProduct {
  name: string
  price: number
  image: string
  description?: string
  views: number
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String },
  views: { type: Number, default: 0 }
})

let Product: Model<IProduct>
try {
  Product = mongoose.model<IProduct>('Product')
} catch {
  Product = mongoose.model<IProduct>('Product', productSchema)
}

export default Product 