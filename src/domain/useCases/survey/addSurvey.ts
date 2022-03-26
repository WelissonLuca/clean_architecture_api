import { SurveyAnswersModel } from '../../models/survey';

export type AddSurveyParams = {
  question: string;
  answers: SurveyAnswersModel[];
  date: Date;
};

export interface IAddSurvey {
  add(data: AddSurveyParams): Promise<void>;
}
