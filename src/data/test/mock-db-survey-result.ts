import { ISaveSurveyResultRepository } from '@data/protocols/db/survey-result/save-survey-result';
import { SurveyResultModel } from '@domain/models/survey-result';
import { mockSurveyResultModel } from '@domain/test';
import { SaveSurveyResultParams } from '@domain/useCases/survey-result/save-survey-result';

export const mockSaveSurveyResultRepository = () => {
  class SaveSurveyResultRepositoryStub implements ISaveSurveyResultRepository {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel());
    }
  }

  return new SaveSurveyResultRepositoryStub();
};
