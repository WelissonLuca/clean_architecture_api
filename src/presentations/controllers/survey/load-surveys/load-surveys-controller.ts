import {
  IController,
  HttpResponse,
  HttpRequest,
  ILoadSurveys,
  ok,
  noContent,
  serverError,
} from './load-surveys-controller-protocols';

export class LoadSurveyController implements IController {
  constructor(private readonly loadSurveys: ILoadSurveys) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();

      return surveys.length ? ok(surveys) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
