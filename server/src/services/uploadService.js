import { cloudinary } from '../config/cloudinaryConfig.js';

class UploadService {
  async uploadImage(file) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            folder: 'posts',
            transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        )
        .end(file.buffer);
    });
  }

  async deleteImage(imageUrl) {
    try {
      const publicId = this.extractPublicId(imageUrl);
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Failed to delete image:', error.message);
    }
  }

  extractPublicId(imageUrl) {
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1];
    const publicId = `posts/${filename.split('.')[0]}`;
    return publicId;
  }
}

export default new UploadService();
