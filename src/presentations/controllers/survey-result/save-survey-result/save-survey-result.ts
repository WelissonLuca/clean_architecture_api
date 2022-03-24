import {
  IController,
  HttpRequest,
  HttpResponse,
  ILoadSurveyById,
  forbidden,
  InvalidParamError,
  ISaveSurveyResult,
  ok,
  serverError,
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

        const surveyResult = await this.saveSurveyResult.save({
          accountId,
          surveyId,
          date: new Date(),
          answer,
        });

        return ok(surveyResult);
      }
      return forbidden(new InvalidParamError('surveyId'));
    } catch (error) {
      return serverError(error);
    }
  }
}
