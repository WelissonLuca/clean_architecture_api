import { InvalidParamError } from '../../../errors/invalidParamError';
import { forbidden } from '../../../helpers/http/http';
import {
  IController,
  HttpRequest,
  HttpResponse,
  ILoadSurveyById,
} from './save-survey-result-protocols';

export class SaveSurveyResultController implements IController {
  constructor(private readonly loadSurveyById: ILoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(
      httpRequest.params.surveyId
    );

    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'));
    }

    return null;
  }
}
