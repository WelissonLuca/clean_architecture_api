import mockDate from 'mockdate';

import { LoadSurveyController } from './load-surveys-controller';
import {
  ISurveyModel,
  ILoadSurveys,
  ok,
} from './load-surveys-controller-protocols';

interface ISutTypes {
  sut: LoadSurveyController;
  loadSurveysStub: ILoadSurveys;
}

const makeFakeSurveys = (): ISurveyModel[] => [
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
const makeLoadSurveysStub = (): ILoadSurveys => {
  class LoadSurveysStub implements ILoadSurveys {
    async load(): Promise<ISurveyModel[]> {
      return new Promise((resolve) => resolve(makeFakeSurveys()));
    }
  }

  return new LoadSurveysStub();
};
const makeSut = (): ISutTypes => {
  const loadSurveysStub = makeLoadSurveysStub();
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

    expect(httpResponse).toEqual(ok(makeFakeSurveys()));
  });
});
