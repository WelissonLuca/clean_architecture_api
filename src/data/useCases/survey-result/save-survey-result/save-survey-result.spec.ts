import mockDate from 'mockdate';

import { DbSaveSurveyResult } from './save-survey-result';
import {
  ISaveSurveyResultRepository,
  SaveSurveyResultParams,
  SurveyResultModel,
} from './save-survey-result-protocols';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: ISaveSurveyResultRepository;
};

const makeFakeSurveyResultData = (): SurveyResultModel => ({
  id: 'valid_id',
  surveyId: 'any_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
});

const surveyResultData = (): Omit<SaveSurveyResultParams, 'id'> => ({
  surveyId: 'any_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
});

const makeSaveSurveyResultRepository = () => {
  class SaveSurveyResultRepositoryStub implements ISaveSurveyResultRepository {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise((resolve) => resolve(makeFakeSurveyResultData()));
    }
  }

  return new SaveSurveyResultRepositoryStub();
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
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
    sut.save(surveyResultData());
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData());
  });

  it('Should throw if save survey repository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.save(surveyResultData());
    expect(promise).rejects.toThrow();
  });

  it('Should return save result on success', async () => {
    const { sut } = makeSut();

    const surveyResult = await sut.save(surveyResultData());
    expect(surveyResult).toEqual(makeFakeSurveyResultData());
  });
});
