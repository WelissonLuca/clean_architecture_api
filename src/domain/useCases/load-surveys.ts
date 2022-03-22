import { SurveyModel } from '../models/survey';

export interface ILoadSurveys {
  load(): Promise<SurveyModel[]>;
}
