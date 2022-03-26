import mockDate from 'mockdate';

import { makeLoadSurveyByIdRepository } from '@data/test';
import {
  mockSurveyModel,
  mockSurveyResultModel,
  throwError,
} from '@domain/test';
import { mockSaveSurveyResultStub } from '@presentations/test';

import { SaveSurveyResultController } from './save-survey-result';
import {
  ILoadSurveyById,
  HttpRequest,
  forbidden,
  InvalidParamError,
  serverError,
  ISaveSurveyResult,
  ok,
} from './save-survey-result-protocols';

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: ILoadSurveyById;
  saveSurveyResultStub: ISaveSurveyResult;
};

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id',
  },
  body: {
    answer: 'any_answer',
  },
  accountId: 'any_account_id',
});

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyByIdRepository();
  const saveSurveyResultStub = mockSaveSurveyResultStub();
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub
  );

  return { sut, loadSurveyByIdStub, saveSurveyResultStub };
};

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });
  test('Should call load survey by id with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

    await sut.handle(mockRequest());

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should return 403 if load survey by id returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const response = await sut.handle(mockRequest());

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('should return 500 if Load survey by idthrows', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockImplementationOnce(throwError);

    const response = await sut.handle(mockRequest());

    expect(response).toEqual(serverError(new Error()));
  });

  test('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({
      params: {
        surveyId: 'any_survey_id',
      },
      body: {
        answer: 'wrong_answer',
      },
    });

    expect(response).toEqual(forbidden(new InvalidParamError('answer')));
  });

  test('Should call save survey result with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut();

    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');

    await sut.handle(mockRequest());

    expect(saveSpy).toHaveBeenCalledWith({
      accountId: 'any_account_id',
      surveyId: 'any_survey_id',
      answer: 'any_answer',
      date: new Date(),
    });
  });

  test('should return 500 if save survey result idthrows', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError);

    const response = await sut.handle(mockRequest());

    expect(response).toEqual(serverError(new Error()));
  });

  test('should return 200 on success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(mockRequest());

    expect(response).toEqual(ok(mockSurveyResultModel()));
  });
});
