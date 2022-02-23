import { badRequest, serverError, ok } from '../../helpers/http/http';
import {
  IAddAccount,
  IAddAccountModel,
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation,
} from './signup-protocols';

export class SignupController implements IController {
  constructor(
    private readonly addAccount: IAddAccount,
    private readonly validation: IValidation
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
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
      } as IAddAccountModel);

      return ok(account);
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
