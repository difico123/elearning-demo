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

const updateQuizParamSchema = Joi.object().keys({
  courseId: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('courseId should be a number'),
  quizId: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('quizId should be a number'),
});

const createQuizSchema = Joi.object().keys({
  name: Joi.string().min(1).required(),
  startTime: Joi.string().min(1).optional(),
  duration: Joi.string()
    .pattern(/^[0-9]+$/)
    .message('duration should be a number'),
});

const bulkQuizUpdateSchema = Joi.object()
  .keys({
    quiz: Joi.object()
      .keys({
        name: Joi.string().min(1).required(),
        duration: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
        shown: Joi.boolean().optional(),
      })
      .required(),
    questions: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.number().optional(),
          name: Joi.string().allow('').optional(), // Allow empty, will filter in service
          mark: Joi.number().required(),
          answerList: Joi.array()
            .items(
              Joi.object().keys({
                id: Joi.number().optional(),
                content: Joi.string().allow('').optional(), // Allow empty, will filter in service
                isCorrect: Joi.boolean().required(),
              }),
            )
            .optional(), // Allow empty, will filter in service
        }),
      )
      .required(),
    deletedQuestionIds: Joi.array().items(Joi.number()).optional(),
    deletedAnswerIds: Joi.array().items(Joi.number()).optional(),
  })
  .unknown(false)
  .options({ stripUnknown: false });

const validationSchemas = {
  topicIdParamSchema,
  createQuizSchema,
  updateQuizParamSchema,
  bulkQuizUpdateSchema,
};

type validationKeyType = keyof typeof validationSchemas;

export function validation(
  ...validations: IValidationKeyType<validationKeyType>[]
) {
  return validations.map(
    (v) => new ValidationPipe(validationSchemas[v.key], v.type),
  );
}
