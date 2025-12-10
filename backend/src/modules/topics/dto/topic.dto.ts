import { ApiProperty } from '@nestjs/swagger';
import { CommonListResponse } from 'src/common/helpers/api.response';
import { Topic } from '../entity/topic.entity';

interface ItemCheckout {
  id: number;
  quantity: number;
}

export class CheckoutDto {
  @ApiProperty()
  items: ItemCheckout[];
}

export class CheckoutCourseDto {
  @ApiProperty()
  courseId: number;
}
export class JoinCourseDto {
  @ApiProperty()
  courseId: number;

  @ApiProperty()
  code: string;
}

export class CategoryDto {
  @ApiProperty()
  categoryId: number;
}

export class CourseDto {
  @ApiProperty()
  id: number;
}

export interface CreateTopicDto {
  name: string;
  description: string;
  content: string;
}
export class TopicListResponse extends CommonListResponse<Topic> {}
