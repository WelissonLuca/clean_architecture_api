import { AddSurveyModel } from '@domain/useCases/survey/addSurvey';

export interface IAddSurveyRepository {
  add(surveyData: AddSurveyModel): Promise<void>;
}
