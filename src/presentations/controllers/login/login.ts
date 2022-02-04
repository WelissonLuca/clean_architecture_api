import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http';
import { IController } from '../../protocols/controller';
import { IHttpResponse, IHttpRequest } from '../../protocols/http';

export class LoginController implements IController {
  handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return Promise.resolve(badRequest(new MissingParamError('email')));
  }
}
