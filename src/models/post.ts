import mongoose, { Schema, Model } from 'mongoose'

interface IComment {
  _id: mongoose.Types.ObjectId
  content: string
  userEmail: string
  createdAt: Date
  parentId?: string
}

interface IPost {
  title: string;
  content: string;
  userEmail: string;
  createdAt: Date;
  comments: IComment[];
}

const commentSchema = new Schema<IComment>({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, required: true },
  parentId: { type: String }
})

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  comments: [commentSchema]
})

let Post: Model<IPost>
try {
  Post = mongoose.model<IPost>('Post')
} catch {
  Post = mongoose.model<IPost>('Post', postSchema)
}

export default Post 