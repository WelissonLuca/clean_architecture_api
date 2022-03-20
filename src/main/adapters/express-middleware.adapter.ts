import { NextFunction, Request, Response } from 'express';

import { IHttpRequest } from '../../presentations/protocols';
import { IMiddleware } from '../../presentations/protocols/middleware';

export const adaptMiddleware = (middleware: IMiddleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest: IHttpRequest = {
      headers: request.headers,
    };

    const httpResponse = await middleware.handle(httpRequest);
    if (httpResponse.statusCode === 200) {
      Object.assign(request, httpResponse.body);
      next();
    } else {
      response.status(httpResponse.statusCode).json({
        error: httpResponse.body.message,
      });
    }
  };
};