import mockDate from 'mockdate';

import { mockSurveys, throwError } from '@domain/test';
import { mockLoadSurveysStub } from '@presentations/test';

import { LoadSurveyController } from './load-surveys-controller';
import {
  ILoadSurveys,
  ok,
  serverError,
  noContent,
} from './load-surveys-controller-protocols';

type SutTypes = {
  sut: LoadSurveyController;
  loadSurveysStub: ILoadSurveys;
};

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveysStub();
  const sut = new LoadSurveyController(loadSurveysStub);
  return {
    sut,
    loadSurveysStub,
  };
};
describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });
  test('should call loadSurveys', () => {
    const { sut, loadSurveysStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysStub, 'load');

    sut.handle({});

    expect(loadSpy).toHaveBeenCalled();
  });

  test('should return 200 on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(ok(mockSurveys()));
  });

  test('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 204 if load surveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut();

    jest
      .spyOn(loadSurveysStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve([])));

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(noContent());
  });
});
