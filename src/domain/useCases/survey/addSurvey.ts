import { SurveyAnswersModel } from '../../models/survey';

export type AddSurveyModel = {
  question: string;
  answers: SurveyAnswersModel[];
  date: Date;
};

export interface IAddSurvey {
  add(data: AddSurveyModel): Promise<void>;
}
