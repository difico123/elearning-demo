import * as Joi from 'joi';
import {
  ORDER_DIRECTION,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  MIN_PAGE,
  MAX_PAGE,
  MIN_PARAM,
  MAX_PARAM,
} from '../constant';

export const querySchema = Joi.object().keys({
  page: Joi.number().allow(null).min(MIN_PAGE).max(MAX_PAGE).optional(),
  limit: Joi.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).optional(),
  orderBy: Joi.string().valid(...Object.values(ORDER_DIRECTION)),
  categoryIds: Joi.string().optional(),
  isHot: Joi.boolean().optional(),
  isLike: Joi.boolean().optional(),
  isUniqueCategory: Joi.boolean().optional(),
});

export const paramSchema = Joi.object().keys({
  param: Joi.number().allow(null).min(MIN_PARAM).max(MAX_PARAM),
});
