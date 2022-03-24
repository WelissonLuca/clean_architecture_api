import { SaveSurveyResultController } from './save-survey-result';
import {
  ILoadSurveyById,
  SurveyModel,
  HttpRequest,
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
});
