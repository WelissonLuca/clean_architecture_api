import mockDate from 'mockdate';

import { mockSurveyResultData, mockSurveyResultModel } from '@domain/test';

import { mockSaveSurveyResultRepository } from '../../../test/mock-db-survey-result';
import { DbSaveSurveyResult } from './save-survey-result';
import { ISaveSurveyResultRepository } from './save-survey-result-protocols';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: ISaveSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);

  return {
    sut,
    saveSurveyResultRepositoryStub,
  };
};
describe('DbSaveSurvey UseCase', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });

  it('should call save survey repository with correct values', () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
    sut.save(mockSurveyResultData());
    expect(saveSpy).toHaveBeenCalledWith(mockSurveyResultData());
  });

  it('Should throw if save survey repository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();

    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(reject(new Error())))
      );

    const promise = sut.save(mockSurveyResultData());

    expect(promise).rejects.toThrow();
  });

  it('Should return save result on success', async () => {
    const { sut } = makeSut();

    const surveyResult = await sut.save(mockSurveyResultData());
    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
