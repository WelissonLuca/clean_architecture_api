import { SurveyResultModel } from '@domain/models/survey-result';
import { mockSurveyResultModel } from '@domain/test';
import {
  ISaveSurveyResult,
  SaveSurveyResultParams,
} from '@domain/useCases/survey-result/save-survey-result';

export const mockSaveSurveyResultStub = (): ISaveSurveyResult => {
  class SaveSurveyResultStub implements ISaveSurveyResult {
    async save(survey: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise((resolve) => resolve(mockSurveyResultModel()));
    }
  }

  return new SaveSurveyResultStub();
};
