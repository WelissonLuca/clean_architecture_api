import { ILoadAccountByToken } from '../../domain/useCases/load-account-by-token';
import { AccessDenied } from '../errors/access-denied-error';
import { forbidden } from '../helpers/http/http';
import { IMiddleware, IHttpRequest, IHttpResponse } from '../protocols';

export class AuthMiddleware implements IMiddleware {
  constructor(private readonly loadAccountByToken: ILoadAccountByToken) {}
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token'];
    if (accessToken) {
      await this.loadAccountByToken.load(accessToken);
    }
    const error = forbidden(new AccessDenied());
    return new Promise((resolve) => resolve(error));
  }
}
