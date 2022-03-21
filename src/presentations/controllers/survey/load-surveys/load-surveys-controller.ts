import {
  IController,
  IHttpResponse,
  IHttpRequest,
  ILoadSurveys,
} from './load-surveys-controller-protocols';

export class LoadSurveyController implements IController {
  constructor(private readonly loadSurveys: ILoadSurveys) {}
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    await this.loadSurveys.load();

    return null;
  }
}
