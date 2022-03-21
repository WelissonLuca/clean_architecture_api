import {
  IController,
  IHttpResponse,
  IHttpRequest,
  ILoadSurveys,
  ok,
} from './load-surveys-controller-protocols';

export class LoadSurveyController implements IController {
  constructor(private readonly loadSurveys: ILoadSurveys) {}
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const surveys = await this.loadSurveys.load();

    return ok(surveys);
  }
}
