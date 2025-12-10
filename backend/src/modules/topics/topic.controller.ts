import { generateChunkFiles } from './../../infra/local-file/videotohlschunks';
import {
  defaultResponseTime,
  mysqlTime,
  removeExtention,
  removeImageFile,
} from 'src/common/ultils';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  Headers,
  BadRequestException,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Instructor } from 'src/common/decorator/custom.decorator';
import {
  CourseAuth,
  InstructorCourseAuth,
} from 'src/common/decorator/auth.decorator';
import { SuccessResponse } from 'src/common/helpers/api.response';
import { CreateTopicDto, TopicListResponse } from './dto/topic.dto';
import LocalFilesInterceptor, {
  videoParams,
} from 'src/infra/local-file/local-files.interceptor';
import { CourseService } from '../course/service/course.service';
import { Topic } from './entity/topic.entity';
import { TopicService } from './service/topic.service';
import { validation } from './joi.request.pipe';
import { Course } from '../course/entity/course.entity';

@ApiTags('Topic')
@Controller('topic')
export class TopicController {
  constructor(
    private readonly topicService: TopicService,
    private readonly courseService: CourseService,
  ) {}

  @Get('short/:courseId')
  @UsePipes(...validation({ key: 'courseIdParamSchema', type: 'param' }))
  async getShortTopics(
    @Res() response: Response,
    @Param() param: { courseId: number },
    @Req() req: Request,
    @Headers('host') host: Headers,
  ) {
    const { courseId } = param;

    let [course] = await this.courseService.instructorCourseDetail(courseId);

    course.image =
      (course.image &&
        (course.image?.startsWith('http')
          ? course.image
          : `${req.protocol}://${host}/course/image/${course.image}`)) ||
      '';

    course.avatar =
      (course.avatar &&
        (course.avatar?.startsWith('http')
          ? course.avatar
          : `${req.protocol}://${host}/user/image/${course.avatar}`)) ||
      '';

    course.startCourseTime =
      (course.startCourseTime && mysqlTime(course.startCourseTime)) ||
      ('' as unknown as Date);

    course.endCourseTime =
      (course.endCourseTime && mysqlTime(course.endCourseTime)) ||
      ('' as unknown as Date);

    let { created_at, updated_at } = defaultResponseTime(
      course.created_at,
      course.updated_at,
    );

    course.created_at = created_at;
    course.updated_at = updated_at;

    const topics = await this.topicService.findShortCourseTopicList(courseId);
    const res = {
      topics: topics,
      course: course,
    };
    return response.status(HttpStatus.OK).json(new SuccessResponse(res));
  }

  @Get(':courseId')
  @UsePipes(...validation({ key: 'courseIdParamSchema', type: 'param' }))
  @CourseAuth()
  async getTopics(
    @Req() req: Request,
    @Res() response: Response,
    @Param() param: { courseId: number },
    @Headers('host') host: Headers,
  ) {
    const { courseId } = param;
    let topics = await this.topicService.getTopicsByCourseId(courseId);
    let res: TopicListResponse = {
      items: topics[0].map((item) => {
        let { video } = item;
        if (video) {
          let videoName = removeExtention(video);
          video = video?.startsWith('http')
            ? video
            : (videoName &&
                `${req.protocol}://${host}/chunk/${videoName}/video.m3u8`) ||
              '';
        }

        return {
          ...item,
          video: video || '',
        };
      }),
      totalItems: topics[1],
    };
    return response.status(HttpStatus.OK).json(new SuccessResponse(res));
  }

  @Post(':courseId')
  @InstructorCourseAuth()
  @UseInterceptors(LocalFilesInterceptor(videoParams))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A new video for the video',
  })
  @UsePipes(
    ...validation(
      { key: 'createTopicSchema', type: 'body' },
      { key: 'courseIdParamSchema', type: 'param' },
    ),
  )
  async createTopic(
    @Res() res: Response,
    @Instructor() instructor: Course,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateTopicDto,
  ) {
    const { name, description, content } = body;
    if (!name || !description || !content) {
      throw new BadRequestException(
        'name, description, content cannot be empty',
      );
    }
    let newTopic: Partial<Topic> = {
      courseId: instructor.id,
      name,
      description,
      content,
      video: file?.filename,
    };

    file?.filename && (await generateChunkFiles());

    let topic = await this.topicService.saveTopic(newTopic);

    return res.status(HttpStatus.OK).json(new SuccessResponse(topic));
  }

  @Put(':courseId/:topicId')
  @InstructorCourseAuth()
  @UseInterceptors(LocalFilesInterceptor(videoParams))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A new video for the video',
  })
  @UsePipes(
    ...validation(
      { key: 'createTopicSchema', type: 'body' },
      { key: 'deleteTopicParam', type: 'param' },
    ),
  )
  async editTopic(
    @Res() res: Response,
    @Instructor() course: Course,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateTopicDto,
    @Param() param: { topicId: string },
  ) {
    const { topicId } = param;
    const { name, description, content } = body;
    if (!name || !description || !content) {
      throw new BadRequestException(
        'name, description, content cannot be empty',
      );
    }
    let existTopic = await this.topicService.existTopic(+topicId);
    if (!existTopic) {
      throw new BadRequestException('not found topic');
    }
    // removeImageFile(existTopic.video, 'video');
    let newTopic: Partial<Topic> = {
      courseId: course.id,
      name,
      description,
      content,
    };
    if (file?.filename) {
      newTopic.video = file?.filename;
      await generateChunkFiles();
    }

    let topic = await this.topicService.update(+topicId, newTopic);

    return res.status(HttpStatus.OK).json(new SuccessResponse(topic));
  }

  @Delete(':courseId/:topicId')
  @InstructorCourseAuth()
  @UsePipes(...validation({ key: 'deleteTopicParam', type: 'param' }))
  async deleteTopic(
    @Res() res: Response,
    @Param() param: { courseId: string; topicId: string },
  ) {
    const { topicId } = param;

    let existTopic = await this.topicService.existTopic(+topicId);
    const { video } = existTopic || {};
    // if (video) {
    //   removeImageFile(video, 'video');
    // }
    let deleteTopic = await this.topicService.delete(+topicId);

    return res.status(HttpStatus.OK).json(new SuccessResponse(deleteTopic));
  }

  @Get(':courseId/:topicId')
  @UsePipes(...validation({ key: 'deleteTopicParam', type: 'param' }))
  @CourseAuth()
  async getTopicDetail(
    @Req() req: Request,
    @Res() response: Response,
    @Param() param: { courseId: number; topicId: number },
    @Headers('host') host: Headers,
  ) {
    const { topicId } = param;
    let topic = await this.topicService.findOneById(topicId);
    const { video } = topic;

    topic.video = video?.startsWith('http')
      ? video
      : (video &&
          `${req.protocol}://${host}/chunk/${removeExtention(
            video,
          )}/video.m3u8`) ||
        '';

    return response.status(HttpStatus.OK).json(new SuccessResponse(topic));
  }
}
