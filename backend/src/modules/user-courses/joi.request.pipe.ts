import { UserCourseStatus } from 'database/constant';
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

const verifyCourseParamSchema = Joi.object().keys({
  courseId: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('courseId should be a number'),
});

const categoryParamSchema = Joi.object().keys({
  courseId: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('categoryId should be a number'),
  code: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('categoryId should be a number'),
});

const userActionParamSchema = Joi.object().keys({
  courseId: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('categoryId should be a number'),
  studentId: Joi.string(),
});

const createCourseSchema = Joi.object().keys({
  name: Joi.string()
    .required()
    .min(1)
    .message('name should have at least one character'),
  description: Joi.string()
    .required()
    .min(1)
    .message('name should have at least one character'),
  isPublished: Joi.boolean().optional(),
  price: Joi.number().min(1).optional(),
});

const userCourseQueryListSchema = Joi.object().keys({
  page: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('page should be a number')
    .optional(),
  keyword: Joi.string().optional(),
  pageSize: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('pageSize should be a number')
    .optional(),
});

const userActiveSchema = Joi.object().keys({
  type: Joi.string().valid(
    UserCourseStatus.reject,
    UserCourseStatus.expired,
    UserCourseStatus.commentBlocking,
    UserCourseStatus.accepted,
    'kick',
    'add',
  ),
  notificationId: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('notificationId should be a number')
    .optional(),
});

const courseValidationSchemas = {
  courseIdParamSchema,
  categoryParamSchema,
  createCourseSchema,
  userCourseQueryListSchema,
  verifyCourseParamSchema,
  userActiveSchema,
  userActionParamSchema,
};

type CourseValidationKeyType = keyof typeof courseValidationSchemas;

export function userCourseValidation(
  ...validations: IValidationKeyType<CourseValidationKeyType>[]
) {
  return validations.map(
    (v) => new ValidationPipe(courseValidationSchemas[v.key], v.type),
  );
}
