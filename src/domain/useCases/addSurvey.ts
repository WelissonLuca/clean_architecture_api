export interface ISurveyAnswers {
  image?: string;
  answer: string;
}

export interface IAddSurveyModel {
  question: string;
  answers: ISurveyAnswers[];
  date: Date;
}

export interface IAddSurvey {
  add(data: IAddSurveyModel): Promise<void>;
}
