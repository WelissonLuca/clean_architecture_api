import {
  IController,
  IHttpResponse,
  IHttpRequest,
  ILoadSurveys,
  ok,
  noContent,
  serverError,
} from './load-surveys-controller-protocols';

export class LoadSurveyController implements IController {
  constructor(private readonly loadSurveys: ILoadSurveys) {}
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();

      return surveys.length ? ok(surveys) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
