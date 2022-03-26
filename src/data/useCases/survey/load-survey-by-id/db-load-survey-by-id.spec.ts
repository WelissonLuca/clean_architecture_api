import mockDate from 'mockdate';

import { makeLoadSurveyByIdRepository } from '@data/test';
import { mockSurveyModel, throwError } from '@domain/test';

import { DbLoadSurveyById } from './db-load-survey-by-id';
import { ILoadSurveyByIdRepository } from './db-load-survey-by-id-protocols';

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: ILoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
  return {
    sut,
    loadSurveyByIdRepositoryStub,
  };
};

describe('DbLoadSurveyById UseCase', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });
  test('should call load survey by id repository with correct id', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');

    await sut.loadById('any_id');

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
  });

  test('should return survey on success', async () => {
    const { sut } = makeSut();

    const survey = await sut.loadById('any_id');

    expect(survey).toEqual(mockSurveyModel());
  });

  test('Should throw if load survey by id repositor throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockImplementationOnce(throwError);

    const promise = sut.loadById('any_token');

    expect(promise).rejects.toThrow();
  });
});
