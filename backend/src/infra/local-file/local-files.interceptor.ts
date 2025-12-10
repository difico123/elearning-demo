import { FileInterceptor } from '@nestjs/platform-express';
import {
  BadRequestException,
  Injectable,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

type keyImagePath = 'course' | 'avatar';

interface LocalFilesInterceptorOptions {
  fieldName?: string;
  path?: string;
  fileFilter?: MulterOptions['fileFilter'];
  limits?: MulterOptions['limits'];
}

export function imageFilter(request, file, callback) {
  if (!file.mimetype.includes('image')) {
    return callback(new BadRequestException('Provide a valid image'), false);
  }
  callback(null, true);
}

export const imageParams = (path: keyImagePath) => {
  return {
    path: `/${path}`,
    fileFilter: imageFilter,
  };
};

export const videoParams = {
  path: `/video`,
  fileFilter: (request, file, callback) => {
    if (!file.mimetype.includes('video')) {
      return callback(new BadRequestException('Provide a valid image'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: Math.pow(1024, 2) * 100, // 4MB
  },
};

function LocalFilesInterceptor(
  options: LocalFilesInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configService: ConfigService) {
      const filesDestination = configService.get('UPLOADED_FILES_DESTINATION');

      const destination = `${filesDestination}${options.path}`;

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            callback(null, filename);
          },
        }),
        fileFilter: options.fileFilter,
        limits: options?.limits || {
          fileSize: Math.pow(1024, 2), // 1MB
        },
      };

      this.fileInterceptor = new (FileInterceptor(
        options.fieldName || 'file',
        multerOptions,
      ))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}

export default LocalFilesInterceptor;
