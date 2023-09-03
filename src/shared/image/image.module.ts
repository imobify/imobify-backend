import { Global, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { CloudinaryProvider } from './providers/cloudinary.provider';

@Global()
@Module({
  providers: [ImageService, CloudinaryProvider],
  exports: [ImageService, CloudinaryProvider],
})
export class ImageModule {}
