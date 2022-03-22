import {
  ILoadSurveys,
  ILoadSurveysRepository,
  SurveyModel,
} from './db-load-surveys-protocols';

export class DbLoadSurveys implements ILoadSurveys {
  constructor(private readonly loadSurveysRepository: ILoadSurveysRepository) {}
  async load(): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll();

    return surveys;
  }
}
