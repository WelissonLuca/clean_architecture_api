import { IAddSurveyRepository } from '@data/protocols/db/survey/add-survey-repository';
import { ILoadSurveyByIdRepository } from '@data/protocols/db/survey/load-survey-by-id-repository';
import { ILoadSurveysRepository } from '@data/protocols/db/survey/load-survey-repository';
import { SurveyModel } from '@domain/models/survey';
import {
  mockSurveyModel,
  mockSurveyResultModel,
  mockSurveys,
} from '@domain/test';
import { AddSurveyParams } from '@domain/useCases/survey/addSurvey';

export const mockAddSurveyRepository = () => {
  class AddSurveyRepositoryStub implements IAddSurveyRepository {
    async add(surveyData: AddSurveyParams): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new AddSurveyRepositoryStub();
};

export const mockLoadSurveysRepository = (): ILoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements ILoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return new Promise((resolve) => resolve(mockSurveys()));
    }
  }
  return new LoadSurveysRepositoryStub();
};

export const makeLoadSurveyByIdRepository = (): ILoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements ILoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return new Promise((resolve) => resolve(mockSurveyModel()));
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};
