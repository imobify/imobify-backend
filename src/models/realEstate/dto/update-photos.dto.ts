import { IsArray, IsOptional } from 'class-validator';
import { HasMimeType, IsFiles, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class UpdatePhotosDto {
  @IsArray()
  @IsOptional()
  deletedPhotos: string[];

  @IsFiles()
  @IsOptional()
  @MaxFileSize(1024 * 1024 * 10, { each: true })
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  images?: MemoryStoredFile[];
}
