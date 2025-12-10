import { generateChunkFiles } from './infra/local-file/videotohlschunks';
import {
  Controller,
  Get,
  Res,
  Param,
  UseInterceptors,
  UploadedFile,
  Post,
  StreamableFile,
  BadRequestException,
} from '@nestjs/common';

import { join } from 'path';
import { Response } from 'express';

import LocalFilesInterceptor, {
  imageParams,
  videoParams,
} from 'src/infra/local-file/local-files.interceptor';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { hasFile } from './common/ultils';

@Controller()
export class AppController {
  @Get('files/:id')
  getFiles(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    let path = join(
      process.cwd(),
      `/uploads/avatar/1666434020416-994288424.jpeg`,
    );
    if (!hasFile(path)) {
      throw new BadRequestException('cant get file');
    }

    const stream = createReadStream(path);

    response.set({
      'Content-Disposition': `inline; filename="${id}"`,
      'Content-Type': 'image/jpeg',
    });

    return new StreamableFile(stream);
  }

  @Get('image/uploads/:type/:name')
  getImage(
    @Param('name') name: string,
    @Param('type') type: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    let path = join(process.cwd(), `uploads/${type}/${name}`);
    if (!hasFile(path)) {
      throw new BadRequestException('cant get file');
    }
    const stream = createReadStream(path);

    response.set({
      'Content-Disposition': `inline; filename="${name}"`,
      'Content-Type': 'image/jpeg',
    });

    return new StreamableFile(stream);
  }

  @Get('/chunk/:name/:file')
  getChunkFiles(@Param('file') file: string, @Param('name') name: string) {
    let filePath = join(process.cwd(), `/temp/chunks/${name}/${file}`);
    if (!hasFile(filePath)) {
      throw new BadRequestException('cant get file');
    }
    const stream = createReadStream(filePath);

    return new StreamableFile(stream);
  }

  @Post('avatar')
  @UseInterceptors(LocalFilesInterceptor(imageParams('avatar')))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A new avatar for the user',
  })
  async addAvatar(@UploadedFile() file: Express.Multer.File) {
    return file;
  }

  @Post('video')
  @UseInterceptors(LocalFilesInterceptor(videoParams))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A new avatar for the user',
  })
  async addVideo(@UploadedFile() file: Express.Multer.File) {
    let { filename } = file;

    await generateChunkFiles();
    return file;
  }
}
