import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http';
import { IController } from '../../protocols/controller';
import { IHttpResponse, IHttpRequest } from '../../protocols/http';
import { IEmailValidator } from '../signup/signup-protocols';

export class LoginController implements IController {
  constructor(private readonly emailValidator: IEmailValidator) {}
  handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body.email) {
      return Promise.resolve(badRequest(new MissingParamError('email')));
    }
    if (!httpRequest.body.password) {
      return Promise.resolve(badRequest(new MissingParamError('password')));
    }

    this.emailValidator.isValid(httpRequest.body.email);
    return Promise.resolve(undefined);
  }
}
