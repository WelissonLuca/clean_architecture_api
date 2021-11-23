import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http';
import { IEmailValidator, IController } from '../protocols';
import { IHttpRequest, IHttpResponse } from '../protocols/http';

export class SignupController implements IController {
  constructor(private readonly emailValidator: IEmailValidator) {}

  handle(httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      return {} as IHttpResponse;
    } catch (error) {
      return serverError();
    }
  }
}
