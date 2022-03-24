import {
  ISaveSurveyResult,
  ISaveSurveyResultRepository,
  SaveSurveyResultModel,
  SurveyResultModel,
} from './save-survey-result-protocols';

export class DbSaveSurveyResult implements ISaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: ISaveSurveyResultRepository
  ) {}
  save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return this.saveSurveyResultRepository.save(data);
  }
}
