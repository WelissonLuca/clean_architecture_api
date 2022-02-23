import { ServerError, UnauthorizedError } from '../../errors';
import { IHttpResponse } from '../../protocols';

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error,
});

export const serverError = (error: Error): IHttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});

export const ok = (data: any): IHttpResponse => ({
  statusCode: 200,
  body: data,
});

export const unauthorized = (): IHttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});
