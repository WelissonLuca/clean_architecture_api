import mockDate from 'mockdate';

import { ILoadSurveyByIdRepository } from '@data/protocols/db/survey/load-survey-by-id-repository';
import { SurveyModel } from '@domain/models/survey';

import { DbLoadSurveyById } from './db-load-survey-by-id';

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: ILoadSurveyByIdRepository;
};

const makeFakeSurvey = (): SurveyModel => ({
  id: 'other_id',
  question: 'other_question',
  answers: [
    {
      image: 'other_image',
      answer: 'other_answer',
    },
  ],
  date: new Date(),
});

const makeLoadSurveysRepository = (): ILoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements ILoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return new Promise((resolve) => resolve(makeFakeSurvey()));
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveysRepository();
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

    expect(survey).toEqual(makeFakeSurvey());
  });

  test('Should throw if load survey by id repositor throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.loadById('any_token');

    expect(promise).rejects.toThrow();
  });
});
