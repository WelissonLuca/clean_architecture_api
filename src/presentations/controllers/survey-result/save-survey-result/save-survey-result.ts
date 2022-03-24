import { serverError } from '../../../helpers/http/http';
import {
  IController,
  HttpRequest,
  HttpResponse,
  ILoadSurveyById,
  forbidden,
  InvalidParamError,
  ISaveSurveyResult,
} from './save-survey-result-protocols';

export class SaveSurveyResultController implements IController {
  constructor(
    private readonly loadSurveyById: ILoadSurveyById,
    private readonly saveSurveyResult: ISaveSurveyResult
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest;
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;
      const survey = await this.loadSurveyById.loadById(surveyId);

      if (survey) {
        const answers = survey.answers.map((a) => a.answer);

        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'));
        }

        await this.saveSurveyResult.save({
          accountId,
          surveyId,
          date: new Date(),
          answer,
        });
      } else {
        return forbidden(new InvalidParamError('surveyId'));
      }

      return null;
    } catch (error) {
      return serverError(error);
    }
  }
}
