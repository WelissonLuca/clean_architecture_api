import {
  IController,
  IHttpResponse,
  IHttpRequest,
  ILoadSurveys,
  ok,
  serverError,
} from './load-surveys-controller-protocols';

export class LoadSurveyController implements IController {
  constructor(private readonly loadSurveys: ILoadSurveys) {}
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();

      return ok(surveys);
    } catch (error) {
      return serverError(error);
    }
  }
}
