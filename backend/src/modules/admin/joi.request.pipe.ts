import { Role } from 'database/constant';
import * as Joi from 'joi';
import {
  IValidationKeyType,
  ValidationPipe,
} from 'src/common/pipe/joi.request.pipe';

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
});

const editCourseChema = Joi.object().keys({
  name: Joi.string().min(1).optional(),
  price: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('price should be a number')
    .optional(),
  isPublished: Joi.string()
    .pattern(/^[0-1]$/)
    .message('isPublished should be 1 or 0')
    .optional(),
});

const editUserChema = Joi.object().keys({
  username: Joi.string().min(1).optional(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('phone should be a number')
    .optional(),
  address: Joi.string().min(1).optional(),
  password: Joi.string().min(1).optional(),
});

const userParamSchema = Joi.object().keys({
  userId: Joi.string().required(),
});

const courseParamSchema = Joi.object().keys({
  courseId: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('phone should be a number')
    .required(),
});

const roleBodySchema = Joi.object().keys({
  role: Joi.string().valid(Role.instructor, Role.student).required(),
});

const validationSchemas = {
  loginSchema,
  editCourseChema,
  editUserChema,
  userParamSchema,
  courseParamSchema,
  roleBodySchema,
};

type validationKeyType = keyof typeof validationSchemas;

export function validation(
  ...validations: IValidationKeyType<validationKeyType>[]
) {
  return validations.map(
    (v) => new ValidationPipe(validationSchemas[v.key], v.type),
  );
}
