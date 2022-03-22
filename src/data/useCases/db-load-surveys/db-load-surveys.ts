import { ISurveyModel } from '@domain/models/survey';
import { ILoadSurveys } from '@domain/useCases/load-surveys';

import { ILoadSurveysRepository } from '../../protocols/db/survey/load-survey-repository';

export class DbLoadSurveys implements ILoadSurveys {
  constructor(private readonly loadSurveysRepository: ILoadSurveysRepository) {}
  async load(): Promise<ISurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll();

    return surveys;
  }
}
