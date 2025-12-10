import { UserCourse } from '../user-courses/entity/user-course.entity';
import { RatingService } from './service/rating.service';
import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Res,
  UsePipes,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Student } from 'src/common/decorator/custom.decorator';
import { StudentCourseAuth } from 'src/common/decorator/auth.decorator';
import { validation } from './joi.request.pipe';
import { SuccessResponse } from 'src/common/helpers/api.response';
import { Rating } from './entity/rating.entity';

@ApiTags('Rating')
@Controller('rating')
export class CommentController {
  constructor(private readonly ratingService: RatingService) {}

  @Post(':courseId')
  @StudentCourseAuth()
  @UsePipes(
    ...validation(
      { type: 'body', key: 'ratingBodySchema' },
      { type: 'param', key: 'ratingParamSchema' },
    ),
  )
  async rating(
    @Res() res: Response,
    @Student() student: UserCourse,
    @Body() body: { rating: string },
    @Param() param: { courseId: string },
  ) {
    let ratingEnum = ['1', '2', '3', '4', '5'];
    let { rating } = body;
    if (!ratingEnum.includes(rating)) {
      throw new ForbiddenException('rating not in range 1 - 5');
    }
    let newRating: Partial<Rating> = {
      userCourseId: student.id,
      rating,
    };
    await this.ratingService.upsertRating(newRating);

    return res
      .status(HttpStatus.OK)
      .json(new SuccessResponse());
  }
}
