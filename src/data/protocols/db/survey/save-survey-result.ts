import { SurveyResultModel } from '@domain/models/survey-result';
import { SaveSurveyResultModel } from '@domain/useCases/save-survey-result';

export interface ISaveSurveyResultRepository {
  save(data: SaveSurveyResultModel): Promise<SurveyResultModel>;
}
