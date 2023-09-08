import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class UploadAvatarDto {
  @IsFile()
  @MaxFileSize(1024 * 1024 * 10)
  @HasMimeType(['image/jpeg', 'image/png'])
  avatar: MemoryStoredFile;
}
