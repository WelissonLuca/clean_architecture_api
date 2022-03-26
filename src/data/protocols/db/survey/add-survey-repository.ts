import { AddSurveyParams } from '@domain/useCases/survey/addSurvey';

export interface IAddSurveyRepository {
  add(surveyData: AddSurveyParams): Promise<void>;
}
