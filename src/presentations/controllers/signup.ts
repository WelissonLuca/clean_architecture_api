import { MissingParamError } from '../errors/missingParamError';
import { badRequest } from '../helpers/http';
import { IHttpRequest, IHttpResponse } from '../protocols/http';

export class SignupController {
  handle(httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    return {} as IHttpResponse;
  }
}
