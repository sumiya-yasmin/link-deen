import { cloudinary } from '../config/cloudinaryConfig.js';
class uploadService{
     async uploadImage(file) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',     
          folder: 'posts',           
          transformation: [           
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);      
          else resolve(result.secure_url);  
        }
      ).end(file.buffer); 
    });
  }
}