import { Request, Response } from 'express';

import { HttpRequest, IController } from '@presentations/protocols';

export const adaptRoute = (controller: IController) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body,
      params: request.params,
      accountId: request.accountId,
    };

    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.statusCode >= 200 || httpResponse.statusCode < 300) {
      return response.status(httpResponse.statusCode).json(httpResponse.body);
    }
    return response.json(httpResponse.body.message);
  };
};
