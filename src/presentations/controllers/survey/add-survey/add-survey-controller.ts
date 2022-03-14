import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation,
} from './add-survey-controller-protocols';

export class AddSurveyController implements IController {
  constructor(private readonly validation: IValidation) {}
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    this.validation.validate(httpRequest.body);
    return new Promise((resolve) => resolve(null));
  }
}
