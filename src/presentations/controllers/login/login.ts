import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, unauthorized, ok, serverError } from '../../helpers/http';
import {
  IHttpRequest,
  IController,
  IEmailValidator,
  IAuthentication,
  IHttpResponse,
} from './login-protocols';

export class LoginController implements IController {
  constructor(
    private readonly emailValidator: IEmailValidator,
    private readonly authentication: IAuthentication
  ) {}
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { email, password } = httpRequest.body;

      const requiredFields = ['email', 'password'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValid = await this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const acessToken = await this.authentication.auth(email, password);

      if (!acessToken) {
        return unauthorized();
      }

      return ok({});
    } catch (error) {
      return serverError(error);
    }
  }
}
