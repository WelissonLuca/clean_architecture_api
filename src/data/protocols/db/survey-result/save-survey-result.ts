import { SurveyResultModel } from '@domain/models/survey-result';
import { SaveSurveyResultParams } from '@domain/useCases/survey-result/save-survey-result';

export interface ISaveSurveyResultRepository {
  save(data: SaveSurveyResultParams): Promise<SurveyResultModel>;
}
