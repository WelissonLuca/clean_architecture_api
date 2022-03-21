export interface ISurveyAnswersModel {
  image?: string;
  answer: string;
}

export interface ISurveyModel {
  id: string;
  question: string;
  answers: ISurveyAnswersModel[];
  date: Date;
}
