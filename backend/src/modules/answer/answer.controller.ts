import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Answer')
@Controller('answer')
export class AnswerController {}
