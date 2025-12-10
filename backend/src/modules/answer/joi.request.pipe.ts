import * as Joi from 'joi';
import {
  IValidationKeyType,
  ValidationPipe,
} from 'src/common/pipe/joi.request.pipe';

const topicIdParamSchema = Joi.object().keys({
  topicId: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('topicId should be a number'),
  courseId: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('courseId should be a number'),
});

const createQuizSchema = Joi.object().keys({
  name: Joi.string().min(1).required(),
  startTime: Joi.string().min(1).optional(),
  duration: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('duration should be a number'),
});

const validationSchemas = {
  topicIdParamSchema,
  createQuizSchema,
};

type validationKeyType = keyof typeof validationSchemas;

export function validation(
  ...validations: IValidationKeyType<validationKeyType>[]
) {
  return validations.map(
    (v) => new ValidationPipe(validationSchemas[v.key], v.type),
  );
}
