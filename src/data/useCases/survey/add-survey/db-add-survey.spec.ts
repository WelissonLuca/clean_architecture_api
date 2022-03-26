import mockDate from 'mockdate';

import { mockAddSurveyRepository } from '@data/test';
import { mockSurveyData, throwError } from '@domain/test';

import { DbAddSurvey } from './db-add-survey';
import { IAddSurveyRepository } from './db-add-survey-protocols';

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: IAddSurveyRepository;
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub,
  };
};
describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });
  it('should call add survey repository with correct values', () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const surveyData = mockSurveyData();
    sut.add(surveyData);
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  it('Should throw if add survey repository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest
      .spyOn(addSurveyRepositoryStub, 'add')
      .mockImplementationOnce(throwError);

    const promise = sut.add(mockSurveyData());

    expect(promise).rejects.toThrow();
  });
});
