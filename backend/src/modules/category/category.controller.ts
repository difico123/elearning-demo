import { CourseCategoryResponse } from './dto/api-response.dto';
import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  UsePipes,
  Headers,
  Req,
  Param,
  Res,
  StreamableFile,
  NotFoundException,
} from '@nestjs/common';
import { SuccessResponse } from 'src/common/helpers/api.response';
import { querySchema } from 'src/common/helpers/api.request';
import { CategoryService } from './service/category.service';
import { JoiValidationPipe } from 'src/common/joi.validation.pipe';
import { QueryListDTO } from 'src/common/dto/api.request.dto';
import { CourseCategoryDto } from './dto/category.dto';
import { ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { RedisCacheService } from '../cache/redis-cache.service';
const fs = require('fs');

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly cacheManager: RedisCacheService,
  ) {}

  @Get()
  @UsePipes(new JoiValidationPipe(querySchema))
  async getAll(
    @Req() req: Request,
    @Query() query: QueryListDTO,
    @Headers('host') host: Headers,
  ) {
    try {
      let response = (await this.cacheManager.setOrgetCache(
        'category',
        async () => {
          const categoryListService: CourseCategoryResponse =
            await this.categoryService.findCourseCategories();
          const categoryListResponse: CourseCategoryDto[] =
            categoryListService.items.map((category: CourseCategoryDto) => {
              let { id, name, avgRating, courseTotal, studentTotal } = category;
              return {
                id,
                name,
                image: `${req.protocol}://${host}/category/image/${category.image}`,
                avgRating,
                courseTotal,
                studentTotal,
              };
            });
          categoryListService.items = categoryListResponse;
          return categoryListService;
        },
      )) as CourseCategoryResponse;

      return new SuccessResponse(response, 'success');
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Get('image/:name')
  @ApiParam({ name: 'name' })
  @ApiResponse({ status: 200, description: 'Found image.' })
  @ApiResponse({ status: 404, description: 'Not Found Image.' })
  Category(
    @Param('name') name: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    let path = join(process.cwd(), `/public/${name}.jpeg`);

    if (!fs.existsSync(path)) {
      throw new NotFoundException('Not found image');
    }
    const stream = createReadStream(path);

    response.set({
      'Content-Disposition': `inline; filename="${name}"`,
      'Content-Type': 'image/jpeg',
    });

    return new StreamableFile(stream);
  }
}
