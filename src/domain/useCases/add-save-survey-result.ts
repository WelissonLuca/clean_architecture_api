import { SurveyResultModel } from '@domain/models/survey-result';

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>;

export interface IAddSaveSurveyResult {
  saveSurveyResult(data: SaveSurveyResultModel): Promise<SurveyResultModel>;
}
