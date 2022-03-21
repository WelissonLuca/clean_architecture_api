import { ISurveyModel } from '../models/survey';

export interface ILoadSurveys {
  load(): Promise<ISurveyModel[]>;
}
