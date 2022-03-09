import { badRequest, serverError, ok } from '../../helpers/http/http';
import {
  IAddAccount,
  IAddAccountModel,
  IAuthentication,
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation,
} from './signup-controller-protocols';

export class SignupController implements IController {
  constructor(
    private readonly addAccount: IAddAccount,
    private readonly validation: IValidation,
    private readonly authentication: IAuthentication
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = httpRequest.body;

      await this.addAccount.add({
        name,
        email,
        password,
      } as IAddAccountModel);

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
