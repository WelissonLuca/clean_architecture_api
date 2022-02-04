import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http';
import { IController } from '../../protocols/controller';
import { IHttpResponse, IHttpRequest } from '../../protocols/http';
import { IEmailValidator } from '../signup/signup-protocols';

export class LoginController implements IController {
  constructor(private readonly emailValidator: IEmailValidator) {}
  handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { email, password } = httpRequest.body;
    if (!email) {
      return Promise.resolve(badRequest(new MissingParamError('email')));
    }
    if (!password) {
      return Promise.resolve(badRequest(new MissingParamError('password')));
    }

    const isValid = this.emailValidator.isValid(email);

    if (!isValid) {
      return Promise.resolve(badRequest(new MissingParamError('email')));
    }
    return Promise.resolve(undefined);
  }
}
