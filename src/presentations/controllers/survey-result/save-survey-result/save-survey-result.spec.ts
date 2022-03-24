import mockDate from 'mockdate';

import { SaveSurveyResultController } from './save-survey-result';
import {
  ILoadSurveyById,
  SurveyModel,
  HttpRequest,
  forbidden,
  InvalidParamError,
  serverError,
  ISaveSurveyResult,
  SurveyResultModel,
  SaveSurveyResultModel,
} from './save-survey-result-protocols';

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: ILoadSurveyById;
  saveSurveyResultStub: ISaveSurveyResult;
};

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
});

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id',
  },
  body: {
    answer: 'any_answer',
  },
  accountId: 'any_account_id',
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'valid_id',
  surveyId: 'valid_survey_id',
  accountId: 'valid_account_id',
  date: new Date(),
  answer: 'valid_answer',
});

const makeLoadSurveyByIdStub = (): ILoadSurveyById => {
  class LoadSurveyByIdStub implements ILoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return new Promise((resolve) => resolve(makeFakeSurvey()));
    }
  }

  return new LoadSurveyByIdStub();
};

const makeSaveSurveyResultStub = (): ISaveSurveyResult => {
  class SaveSurveyResultStub implements ISaveSurveyResult {
    async save(survey: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise((resolve) => resolve(makeFakeSurveyResult()));
    }
  }

  return new SaveSurveyResultStub();
};
const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyByIdStub();
  const saveSurveyResultStub = makeSaveSurveyResultStub();
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

    await sut.handle(makeFakeRequest());

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should return 403 if load survey by id returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('should return 500 if Load survey by idthrows', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const response = await sut.handle(makeFakeRequest());

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

    await sut.handle(makeFakeRequest());

    expect(saveSpy).toHaveBeenCalledWith({
      accountId: 'any_account_id',
      surveyId: 'any_survey_id',
      answer: 'any_answer',
      date: new Date(),
    });
  });

  test('should return 500 if save survey result idthrows', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest
      .spyOn(saveSurveyResultStub, 'save')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(serverError(new Error()));
  });
});
