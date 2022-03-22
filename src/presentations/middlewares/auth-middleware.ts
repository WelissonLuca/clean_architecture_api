import {
  IMiddleware,
  HttpRequest,
  HttpResponse,
  ILoadAccountByToken,
  ok,
  forbidden,
  AccessDenied,
  serverError,
} from './auth-middleware-protocols';

export class AuthMiddleware implements IMiddleware {
  constructor(
    private readonly loadAccountByToken: ILoadAccountByToken,
    private readonly role?: string
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token'];
      if (accessToken) {
        const account = await this.loadAccountByToken.load(
          accessToken,
          this.role
        );

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
