import { serverError } from '../../../helpers/http/http';
import {
  IController,
  HttpRequest,
  HttpResponse,
  ILoadSurveyById,
  forbidden,
  InvalidParamError,
} from './save-survey-result-protocols';

export class SaveSurveyResultController implements IController {
  constructor(private readonly loadSurveyById: ILoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;
      const survey = await this.loadSurveyById.loadById(surveyId);

      if (survey) {
        const answers = survey.answers.map((a) => a.answer);

        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'));
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'));
      }

      return null;
    } catch (error) {
      return serverError(error);
    }
  }
}
