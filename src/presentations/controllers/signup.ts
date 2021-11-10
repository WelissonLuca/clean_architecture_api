import { MissingParamError } from '../errors/missingParamError';
import { badRequest } from '../helpers/http';
import { IHttpRequest, IHttpResponse } from '../protocols/http';

export class SignupController {
  handle(httpRequest: IHttpRequest): IHttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'));
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }
    return {} as IHttpResponse;
  }
}
