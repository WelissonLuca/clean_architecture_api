import { InvalidParamError } from '../../errors';
import { badRequest, serverError, ok } from '../../helpers/http';
import {
  IAddAccount,
  IAddAccountModel,
  IController,
  IEmailValidator,
  IHttpRequest,
  IHttpResponse,
  IValidation,
} from './signup-protocols';

export class SignupController implements IController {
  constructor(
    private readonly emailValidator: IEmailValidator,
    private readonly addAccount: IAddAccount,
    private readonly validation: IValidation
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.addAccount.add({
        name,
        email,
        password,
      } as IAddAccountModel);

      return ok(account);
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
