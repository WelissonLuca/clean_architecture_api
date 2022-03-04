import { Request, Response } from 'express';

import { IHttpRequest, IController } from '../../../presentations/protocols';

export const adaptRoute = (controller: IController) => {
  return async (request: Request, response: Response) => {
    const httpRequest: IHttpRequest = {
      body: request.body,
    };

    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.statusCode === 200) {
      response.status(httpResponse.statusCode).json(httpResponse.body);
    }
    response.status(httpResponse.statusCode).json(httpResponse.body.message);
  };
};
