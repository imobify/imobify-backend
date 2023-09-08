import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './types/cloudinary-response';
import streamifier = require('streamifier');
import { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class ImageService {
  uploadFileToCloudinary(file: MemoryStoredFile): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);

        resolve(result);
      });

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFileFromCloudinary(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
  }
}
