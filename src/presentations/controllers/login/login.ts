import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http';
import { IController } from '../../protocols/controller';
import { IHttpResponse, IHttpRequest } from '../../protocols/http';

export class LoginController implements IController {
  handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body.email) {
      return Promise.resolve(badRequest(new MissingParamError('email')));
    }
    if (!httpRequest.body.password) {
      return Promise.resolve(badRequest(new MissingParamError('password')));
    }
    return Promise.resolve(undefined);
  }
}
