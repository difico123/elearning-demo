import {
  ArgumentMetadata,
  BadRequestException,
  Paramtype,
  PipeTransform,
} from '@nestjs/common';
import Joi from 'joi';
import { paramSchema, querySchema } from '../helpers/api.request';

export class ParamValidation implements PipeTransform {
  async transform(value, metadata: ArgumentMetadata) {
    if (metadata.type === 'param') {
      const { error } = paramSchema.validate({ param: value });
      if (error) {
        throw new BadRequestException({ errors: error.details });
      }
    }
    return value;
  }
}

export class QueryValidation implements PipeTransform {
  async transform(value, metadata: ArgumentMetadata) {
    if (metadata.type === 'query') {
      const { error } = querySchema.validate(value);
      if (error) {
        throw new BadRequestException({ errors: error.details });
      }
    }
    return value;
  }
}

export class ValidationPipe implements PipeTransform {
  private schema: Joi.ObjectSchema<any>;
  private paramType: Paramtype;
  constructor(schema: Joi.ObjectSchema<any>, paramType: Paramtype) {
    this.schema = schema;
    this.paramType = paramType;
  }
  async transform(value, metadata: ArgumentMetadata) {
    if (metadata.type === this.paramType) {
      const { error } = this.schema.validate(value);
      if (error) {
        throw new BadRequestException({ errors: error.details });
      }
    }
    return value;
  }
}

export interface IValidationKeyType<T> {
  key: T;
  type: Paramtype;
}