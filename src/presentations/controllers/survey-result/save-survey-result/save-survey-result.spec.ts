import { SaveSurveyResultController } from './save-survey-result';
import {
  ILoadSurveyById,
  SurveyModel,
  HttpRequest,
  forbidden,
  InvalidParamError,
  serverError,
} from './save-survey-result-protocols';

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: ILoadSurveyById;
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

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id',
  },
  body: {
    answer: 'any_answer',
  },
});

const makeLoadSurveyByIdStub = (): ILoadSurveyById => {
  class LoadSurveyByIdStub implements ILoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return new Promise((resolve) => resolve(makeFakeSurvey()));
    }
  }

  return new LoadSurveyByIdStub();
};
const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyByIdStub();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub);

  return { sut, loadSurveyByIdStub };
};

describe('SaveSurveyResult Controller', () => {
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
});
