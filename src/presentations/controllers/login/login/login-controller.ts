import {
  badRequest,
  unauthorized,
  ok,
  serverError,
} from '@presentations/helpers/http/http';

import {
  HttpRequest,
  IController,
  IAuthentication,
  HttpResponse,
  IValidation,
} from './login-controller-protocols';

export class LoginController implements IController {
  constructor(
    private readonly authentication: IAuthentication,
    private readonly validation: IValidation
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;

      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const accessToken = await this.authentication.auth({ email, password });

      if (!accessToken) {
        return unauthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
