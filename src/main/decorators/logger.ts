import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '../../presentations/protocols';

export class LogControllerDecorator implements IController {
  constructor(private readonly controller: IController) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);

    if (httpResponse.statusCode === 500) {
      console.error(httpResponse.body.stack);
    }

    return httpResponse;
  }
}
