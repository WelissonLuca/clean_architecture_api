import {
  badRequest,
  serverError,
  noContent,
} from '@presentations/helpers/http/http';

import {
  IController,
  HttpRequest,
  HttpResponse,
  IValidation,
  IAddSurvey,
} from './add-survey-controller-protocols';

export class AddSurveyController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly addSurvey: IAddSurvey
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { question, answers } = httpRequest.body;

      await this.addSurvey.add({
        question,
        answers,
        date: new Date(),
      });

      return Promise.resolve(noContent());
    } catch (error) {
      return Promise.resolve(serverError(error));
    }
  }
}
