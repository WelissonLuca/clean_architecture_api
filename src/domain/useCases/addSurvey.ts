import { ISurveyAnswersModel } from '../models/survey';

export interface IAddSurveyModel {
  question: string;
  answers: ISurveyAnswersModel[];
  date: Date;
}

export interface IAddSurvey {
  add(data: IAddSurveyModel): Promise<void>;
}
