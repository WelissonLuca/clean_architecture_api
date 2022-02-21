import { IAuthentication } from '../../../domain/useCases/authentication';
import { MissingParamError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/http';
import { IController } from '../../protocols/controller';
import { IHttpResponse, IHttpRequest } from '../../protocols/http';
import { IEmailValidator } from '../signup/signup-protocols';

export class LoginController implements IController {
  constructor(
    private readonly emailValidator: IEmailValidator,
    private readonly authentication: IAuthentication
  ) {}
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
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
      await this.authentication.auth(email, password);

      return Promise.resolve(ok({}));
    } catch (error) {
      return Promise.resolve(serverError(error));
    }
  }
}
