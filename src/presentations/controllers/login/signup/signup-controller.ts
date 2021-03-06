import { EmailInUseError } from '@presentations/errors/email-in-use-error';
import {
  badRequest,
  serverError,
  ok,
  forbidden,
} from '@presentations/helpers/http/http';

import {
  IAddAccount,
  AddAccountParams,
  IAuthentication,
  IController,
  HttpRequest,
  HttpResponse,
  IValidation,
} from './signup-controller-protocols';

export class SignupController implements IController {
  constructor(
    private readonly addAccount: IAddAccount,
    private readonly validation: IValidation,
    private readonly authentication: IAuthentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({
        name,
        email,
        password,
      } as AddAccountParams);

      if (!account) {
        return forbidden(new EmailInUseError());
      }

      const accessToken = await this.authentication.auth({
        email,
        password,
      });

      return ok({ accessToken });
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
