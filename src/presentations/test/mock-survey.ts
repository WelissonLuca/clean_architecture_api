import { SurveyModel } from '@domain/models/survey';
import { mockSurveys } from '@domain/test';
import { IAddSurvey } from '@domain/useCases/survey/addSurvey';
import { ILoadSurveys } from '@domain/useCases/survey/load-surveys';

export const mockAddSurveyStub = (): IAddSurvey => {
  class AddSurveyStub implements IAddSurvey {
    async add(survey: any): Promise<void> {
      return Promise.resolve();
    }
  }
  return new AddSurveyStub();
};

export const mockLoadSurveysStub = (): ILoadSurveys => {
  class LoadSurveysStub implements ILoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveys());
    }
  }

  return new LoadSurveysStub();
};
