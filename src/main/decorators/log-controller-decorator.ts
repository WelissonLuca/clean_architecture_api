import { ILogErrorRepository } from '@data/protocols/db/log/log-error-repository';
import {
  IController,
  HttpRequest,
  HttpResponse,
} from '@presentations/protocols';

export class LogControllerDecorator implements IController {
  constructor(
    private readonly controller: IController,
    private readonly logErrorRepository?: ILogErrorRepository
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);

    if (httpResponse.statusCode === 500) {
      this.logErrorRepository.logError(httpResponse.body.stack);
    }

    return httpResponse;
  }
}
