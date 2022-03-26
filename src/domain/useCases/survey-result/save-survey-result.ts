import { SurveyResultModel } from '@domain/models/survey-result';

export type SaveSurveyResultParams = Omit<SurveyResultModel, 'id'>;

export interface ISaveSurveyResult {
  save(data: SaveSurveyResultParams): Promise<SurveyResultModel>;
}
