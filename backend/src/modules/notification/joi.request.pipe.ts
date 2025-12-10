import { Paramtype } from '@nestjs/common';
import * as Joi from 'joi';
import { ValidationPipe } from 'src/common/pipe/joi.request.pipe';

const notificationQueryListSchema = Joi.object().keys({
  page: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('page should be a number')
    .optional(),
  pageSize: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('pageSize should be a number')
    .optional(),
});

const validationSchemas = {
  notificationQueryListSchema,
};

type validationKey = keyof typeof validationSchemas;

interface IValidation {
  key: validationKey;
  type: Paramtype;
}

export function notificationValidation(...validations: IValidation[]) {
  return validations.map(
    (v) => new ValidationPipe(validationSchemas[v.key], v.type),
  );
}
