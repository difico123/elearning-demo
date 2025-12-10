import * as Joi from 'joi';
import {
  IValidationKeyType,
  ValidationPipe,
} from 'src/common/pipe/joi.request.pipe';

const courseIdParamSchema = Joi.object().keys({
  courseId: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('courseId should be a number'),
});

const createTopicSchema = Joi.object().keys({
  name: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  content: Joi.string().min(1).required(),
});

const deleteTopicParam = Joi.object().keys({
  courseId: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('courseId should be a number'),
  topicId: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('topicId should be a number'),
});

const validationSchemas = {
  courseIdParamSchema,
  createTopicSchema,
  deleteTopicParam,
};

type validationKeyType = keyof typeof validationSchemas;

export function validation(
  ...validations: IValidationKeyType<validationKeyType>[]
) {
  return validations.map(
    (v) => new ValidationPipe(validationSchemas[v.key], v.type),
  );
}
