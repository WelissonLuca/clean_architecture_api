import { IAddSurveyModel } from '@domain/useCases/addSurvey';

export interface IAddSurveyRepository {
  add(surveyData: IAddSurveyModel): Promise<void>;
}
