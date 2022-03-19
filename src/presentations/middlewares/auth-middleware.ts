import { AccessDenied } from '../errors/access-denied-error';
import { forbidden } from '../helpers/http/http';
import { IMiddleware, IHttpRequest, IHttpResponse } from '../protocols';

export class AuthMiddleware implements IMiddleware {
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const error = forbidden(new AccessDenied());
    return new Promise((resolve) => resolve(error));
  }
}
