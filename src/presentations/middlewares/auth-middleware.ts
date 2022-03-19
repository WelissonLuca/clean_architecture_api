import { ILoadAccountByToken } from '../../domain/useCases/load-account-by-token';
import { AccessDenied } from '../errors/access-denied-error';
import { forbidden, ok, serverError } from '../helpers/http/http';
import { IMiddleware, IHttpRequest, IHttpResponse } from '../protocols';

export class AuthMiddleware implements IMiddleware {
  constructor(private readonly loadAccountByToken: ILoadAccountByToken) {}
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token'];
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken);

        if (account) {
          return ok({ accountId: account.id });
        }
      }
      const error = forbidden(new AccessDenied());
      return new Promise((resolve) => resolve(error));
    } catch (error) {
      return serverError(error);
    }
  }
}
