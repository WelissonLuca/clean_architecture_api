import { ISurveyModel } from '../../../../domain/models/survey';

export interface ILoadSurveysRepository {
  loadAll(): Promise<ISurveyModel[]>;
}
