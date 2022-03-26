import {
  ISaveSurveyResult,
  ISaveSurveyResultRepository,
  SaveSurveyResultParams,
  SurveyResultModel,
} from './save-survey-result-protocols';

export class DbSaveSurveyResult implements ISaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: ISaveSurveyResultRepository
  ) {}
  save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return this.saveSurveyResultRepository.save(data);
  }
}
