import { ILogErrorRepository } from '../../data/protocols/log-error-repository';
import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '../../presentations/protocols';

export class LogControllerDecorator implements IController {
  constructor(
    private readonly controller: IController,
    private readonly logErrorRepository?: ILogErrorRepository
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);

    if (httpResponse.statusCode === 500) {
      this.logErrorRepository.logError(httpResponse.body.stack);
    }

    return httpResponse;
  }
}
