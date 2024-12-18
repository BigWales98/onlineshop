'use client'

import { useState } from 'react'
import { uploadImage } from '@/utils/cloudinary'

export default function ImageUpload() {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    try {
      setUploading(true)
      const imageUrl = await uploadImage(e.target.files[0])
      console.log('Uploaded image URL:', imageUrl)
      // 여기서 이미지 URL을 상태나 DB에 저장
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>업로드 중...</p>}
    </div>
  )
} 