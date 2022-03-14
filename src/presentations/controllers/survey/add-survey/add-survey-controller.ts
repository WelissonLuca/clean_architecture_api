import { badRequest } from '../../../helpers/http/http';
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation,
} from './add-survey-controller-protocols';

export class AddSurveyController implements IController {
  constructor(private readonly validation: IValidation) {}
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const error = this.validation.validate(httpRequest.body);

    if (error) {
      return badRequest(error);
    }
    return new Promise((resolve) => resolve(null));
  }
}
