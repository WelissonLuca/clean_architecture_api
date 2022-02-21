import { IAuthentication } from '../../../domain/useCases/authentication';
import { InvalidParamError, MissingParamError } from '../../errors';
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

      await this.authentication.auth(email, password);

      return ok({});
    } catch (error) {
      return serverError(error);
    }
  }
}
