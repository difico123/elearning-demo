export enum ORDER_DIRECTION {
  ASC = 'ASC',
  DESC = 'DESC',
}
export const EXPIRED_TOKEN_SECONDS = 20 * 60;

export type TYPE_ORM_ORDER_DIRECTION = 'ASC' | 'DESC';

export const DEFAULT_FIRST_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const DEFAULT_LIMIT_FOR_PAGINATION = 10;
export const DEFAULT_ORDER_BY = 'createdAt';
export const DEFAULT_ORDER_DIRECTION = ORDER_DIRECTION.ASC;
export const DEFAULT_PAGE = 1;

export const MIN_ID = 1;
export const MIN_PAGE_SIZE = 0;
export const MIN_PAGE = 1;
export const MAX_PAGE_SIZE = 10000;
export const MAX_PAGE = 10000;

export const MIN_PARAM = 1;
export const MAX_PARAM = 1000;
export const DEFAULT_EXPIRE_CACHE = 3600
export const STRIPE_CLIENT = 'STRIPE_CLIENT'

export const jwtConstants = {
  secret: 'secretKey',
};

export interface IGoogleUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  accessToken: string;
}
