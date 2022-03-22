import mockDate from 'mockdate';

import { DbLoadSurveys } from './db-load-surveys';
import {
  ILoadSurveysRepository,
  SurveyModel,
} from './db-load-surveys-protocols';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: ILoadSurveysRepository;
};

const makeFakeSurveys = (): SurveyModel[] => [
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  },
  {
    id: 'other_id',
    question: 'other_question',
    answers: [
      {
        image: 'other_image',
        answer: 'other_answer',
      },
    ],
    date: new Date(),
  },
];

const makeLoadSurveysRepository = (): ILoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements ILoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return new Promise((resolve) => resolve(makeFakeSurveys()));
    }
  }
  return new LoadSurveysRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
  return {
    sut,
    loadSurveysRepositoryStub,
  };
};

describe('DbLoadSurveys UseCase', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });
  test('should call load survey repository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');

    await sut.load();

    expect(loadAllSpy).toHaveBeenCalled();
  });

  test('should return a list of surveys on success', async () => {
    const { sut } = makeSut();

    const surveys = await sut.load();

    expect(surveys).toEqual(makeFakeSurveys());
  });

  test('Should throw if load survey repository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.load();

    expect(promise).rejects.toThrow();
  });
});
