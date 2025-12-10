import * as Joi from 'joi';
import { QueryListDTO } from 'src/common/dto/api.request.dto';

export const storyIdSchema = Joi.object().keys({
  ids: Joi.string().required(),
});

export interface QueryListSToryDTO extends QueryListDTO {
  categoryIds: string;
  isHot: boolean;
}
