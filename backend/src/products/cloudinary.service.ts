import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'ecom-project',
        },
        (error, result) => {
          if (error) return reject(error);
          if (result) resolve(result.secure_url);
          else reject(new Error('Unknown error during upload'));
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
