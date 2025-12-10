import { UserCourseStatus } from './../../../database/constant';
import { TopicService } from './../topics/service/topic.service';
import { UserCourse } from './../user-courses/entity/user-course.entity';
import { CommentService } from './service/comment.service';
import { CommentType, Role } from 'database/constant';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UsePipes,
  Query,
  Delete,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IUserJwt } from 'src/common/interfaces';
import {
  Instructor,
  Student,
  User,
} from 'src/common/decorator/custom.decorator';
import { CourseAuth } from 'src/common/decorator/auth.decorator';
import { validation } from './joi.request.pipe';
import { SuccessResponse } from 'src/common/helpers/api.response';
import { Comment } from './entity/comment.entity';
import { Course } from '../course/entity/course.entity';
import { Topic } from '../topics/entity/topic.entity';
import { NotificationService } from '../notification/service/notification.service';
import { getPaginatedItems, mysqlTimeStamp } from 'src/common/ultils';
import { checkBadWord } from 'src/infra/py/check-bad-word';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly topicService: TopicService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post(':courseId')
  @CourseAuth()
  @UsePipes(
    ...validation(
      { type: 'query', key: 'topicQuerySchema' },
      { type: 'body', key: 'commentBodySchema' },
      { type: 'param', key: 'commentParamSchema' },
    ),
  )
  async comment(
    @Res() res: Response,
    @Instructor() instructor: Course,
    @Student() student: UserCourse,
    @User() user: IUserJwt,
    @Query() query: { topicId: string },
    @Body() body: { comment: string },
    @Param() param: { courseId: string },
  ) {
    if (student?.status === UserCourseStatus.commentBlocking) {
      throw new ForbiddenException('you can not comment in this course');
    }
    let topic: Partial<Topic> = {};
    if (query?.topicId) {
      topic = await this.topicService.existTopic(+query?.topicId);
    }
    const { comment } = body;
    // check comment
    let idBad = await checkBadWord(comment);

    // save comment to db
    let newComment: Partial<Comment> = {
      userId: user.id,
      sourceId: topic.id ? +topic?.id : +param?.courseId,
      type: topic.id ? CommentType.topic : CommentType.course,
      comment,
      time: new Date(),
      isBad: idBad,
    };

    // get commentor in course or topic
    let commentorIds = await this.commentService.findCommentors(
      newComment.type,
      newComment.sourceId,
    );

    await Promise.all([
      ...commentorIds.map((userId) => {
        if (userId !== user.id) {
          let newNotification = {
            commentType: newComment.type,
            userId,
            courseOrTopicId: newComment.sourceId,
            username:
              user.role === Role.instructor ? 'Giảng viên' : user.username,
            sourceUserId: user.id,
          };
          this.notificationService.saveComment(newNotification);
        }
      }),
      this.commentService.saveComment(newComment),
    ]);

    return res.status(HttpStatus.OK).json(new SuccessResponse());
  }

  @Get(':courseId')
  @CourseAuth()
  @UsePipes(
    ...validation(
      { type: 'query', key: 'queryListSchema' },
      { type: 'param', key: 'commentParamSchema' },
    ),
  )
  async getComment(
    @Res() res: Response,
    @Query() query: { topicId: string; page: string; pageSize: string },
    @Param() param: { courseId: string },
  ) {
    let topic: Partial<Topic> = {};
    let { topicId, page = 1, pageSize = 8 } = query;
    if (topicId) {
      topic = await this.topicService.existTopic(+topicId);
    }

    // get commentor in course or topic
    let commentors = await this.commentService.findComments(
      topicId ? CommentType.topic : CommentType.course,
      topicId ? +topicId : +param.courseId,
    );

    let response = {
      ...getPaginatedItems(
        commentors.map((item) => {
          return {
            ...item,
            time: mysqlTimeStamp(item.time),
          };
        }),
        +page,
        +pageSize,
      ),
      totalItems: commentors?.length,
    };

    return res.status(HttpStatus.OK).json(new SuccessResponse(response));
  }

  @Delete(':courseId/:commentId')
  @CourseAuth()
  @UsePipes(...validation({ type: 'param', key: 'deleteCommentParamSchema' }))
  async deleteComment(
    @Res() res: Response,
    @User() user: IUserJwt,
    @Param() param: { courseId: string; commentId: string },
  ) {
    let { commentId } = param;
    if (!commentId) {
      throw new NotFoundException('not found commentId');
    }
    let existComment = await this.commentService.existComment(+commentId);

    if (user.role === Role.student && existComment.userId !== user.id) {
      throw new ForbiddenException('you can not delete this comment');
    }

    this.commentService.deleteComment(+commentId);
    return res.status(HttpStatus.OK).json(new SuccessResponse());
  }
}
