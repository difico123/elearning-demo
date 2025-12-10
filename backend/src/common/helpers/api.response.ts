import { Injectable, HttpStatus } from '@nestjs/common';

const DEFAULT_SUCCESS_MESSAGE = 'success';

@Injectable()
export class ApiResponse<T> {
  public code: number;
  public message: string;
  public data: T;
}

export class CommonListResponse<T> {
  items: T[];
  page?: number;
  pageSize?: number;
  total_pages?: number;
  totalItems: number;
}

export interface IErrorResponse {
  key: string;
  errorCode: number;
  message: string;
}

export class SuccessResponse {
  constructor(data = {}, message = DEFAULT_SUCCESS_MESSAGE) {
    return {
      success: true,
      code: HttpStatus.OK,
      message,
      data,
    };
  }
}

export class ErrorResponse {
  constructor(
    code = HttpStatus.INTERNAL_SERVER_ERROR,
    message = '',
    errors: IErrorResponse[] = [],
  ) {
    return {
      success: false,
      code,
      message,
      errors,
    };
  }
}
