import * as Joi from 'joi';
import {
  IValidationKeyType,
  ValidationPipe,
} from 'src/common/pipe/joi.request.pipe';

const userChangeSchema = Joi.object().keys({
  username: Joi.string().min(1).message('username should be string').optional(),
  address: Joi.string().min(1).message('address should be string').optional(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('phone should be a number')
    .optional(),
  currentPassword: Joi.string().min(8).optional(),
  password: Joi.string().min(8).optional(),
});

const validationSchemas = {
  userChangeSchema,
};

type validationKeyType = keyof typeof validationSchemas;

export function validation(
  ...validations: IValidationKeyType<validationKeyType>[]
) {
  return validations.map(
    (v) => new ValidationPipe(validationSchemas[v.key], v.type),
  );
}
