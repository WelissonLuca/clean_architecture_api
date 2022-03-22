import { AddSurveyModel } from '@domain/useCases/addSurvey';

export interface IAddSurveyRepository {
  add(surveyData: AddSurveyModel): Promise<void>;
}
