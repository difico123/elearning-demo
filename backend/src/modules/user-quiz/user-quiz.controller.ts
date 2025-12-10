import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('UserQuiz')
@Controller('user-quiz')
export class UserQuizController {}
