import {
  DEFAULT_ORDER_DIRECTION,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from '../constant';

export const queryListClause = (orderByField, page, limit, orderBy) => {
  page = page || DEFAULT_PAGE;
  limit = limit || DEFAULT_LIMIT;
  orderBy = orderBy || DEFAULT_ORDER_DIRECTION;

  const limitClause = `LIMIT ${limit}`;
  const offsetClause = `OFFSET ${(page - 1) * limit}`;
  const orderByClause = `ORDER BY ${orderByField} ${orderBy}`;

  return `${orderByClause} ${limitClause} ${offsetClause}`;
};
