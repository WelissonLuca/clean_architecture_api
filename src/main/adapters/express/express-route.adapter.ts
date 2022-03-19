import { Request, Response } from 'express';

import { IHttpRequest, IController } from '../../../presentations/protocols';

export const adaptRoute = (controller: IController) => {
  return async (request: Request, response: Response) => {
    const httpRequest: IHttpRequest = {
      body: request.body,
    };

    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.statusCode >= 200 || httpResponse.statusCode < 300) {
      return response.status(httpResponse.statusCode).json(httpResponse.body);
    }
    return response.json(httpResponse.body.message);
  };
};
