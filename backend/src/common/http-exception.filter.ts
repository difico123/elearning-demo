import {
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';
import { ValidationErrorItem } from 'joi';
import { IError } from './interfaces';

const DEFAULT_CONFLICT_EXCEPTION_MESSAGE = 'conflict';

const translateErrorValidator = async (errors: ValidationErrorItem[] = []) => {
  const errorMessages = await Promise.all(
    errors?.map((error: ValidationErrorItem) => {
      const { context, message } = error;
      const newMessage = message.replace(/["/]/g, '');
      const errorResponse = {
        key: context.key,
        errorCode: HttpStatus.BAD_REQUEST,
        message: newMessage,
      };

      return errorResponse;
    }),
  );

  return errorMessages;
};
const handleBadRequestException = async (
  exception: BadRequestException,
  request: Request,
): Promise<IError> => {
  const response = exception.getResponse() as any;

  const errorResponse = await translateErrorValidator(response.errors);

  return {
    success: false,
    code: HttpStatus.BAD_REQUEST,
    message: exception.message,
    errors: errorResponse,
  };
};

const handleInternalErrorException = async (
  exception: InternalServerErrorException,
  request: Request,
): Promise<IError> => {
  const response = exception.getResponse() as any;
  const logId = `${Date.now().toString()}`;
  const message = `SYSTEM_ERROR ${logId}: ${exception.message}`;
  return {
    success: false,
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    message: message,
    errors: [response],
  };
};

const handleUnauthorizedException = async (
  exception: InternalServerErrorException,
  request: Request,
): Promise<IError> => {
  const response = exception.getResponse() as any;
  const status = exception.getStatus();
  return {
    success: false,
    code: HttpStatus.UNAUTHORIZED,
    message: response?.message || '',
    errors: [response],
  };
};

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  constructor() {
    super();
  }
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const apiResponse = exception.getResponse() as any;

    const status = exception.getStatus();

    let res: IError = {
      success: false,
      code: exception.getStatus(),
      message: `${apiResponse?.message || 'Error'}`,
      errors: apiResponse?.errors || [apiResponse],
    };

    if (exception instanceof InternalServerErrorException) {
      res = await handleInternalErrorException(exception, request);
      return response.status(status).json(res);
    } else if (exception instanceof BadRequestException) {
      res = await handleBadRequestException(exception, request);
      return response.status(status).json(res);
    } else if (exception instanceof UnauthorizedException) {
      res = await handleUnauthorizedException(exception, request);
      return response.status(status).json(res);
    } else {
      return response.status(status).json(res);
    }
  }
}
