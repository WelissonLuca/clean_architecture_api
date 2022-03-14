import { DbAddSurvey } from './db-add-survey';
import {
  IAddSurveyModel,
  IAddSurveyRepository,
} from './db-add-survey-protocols';

interface ISutTypes {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: IAddSurveyRepository;
}

const makeFakeSurveyData = () => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
});

const makeAddSurveyRepository = () => {
  class AddSurveyRepositoryStub implements IAddSurveyRepository {
    async add(surveyData: IAddSurveyModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new AddSurveyRepositoryStub();
};

const makeSut = (): ISutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub,
  };
};
describe('DbAddSurvey UseCase', () => {
  it('should call add survey repository with correct values', () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const surveyData = makeFakeSurveyData();
    sut.add(surveyData);
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  it('Should throw if add survey repository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest
      .spyOn(addSurveyRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.add(makeFakeSurveyData());

    expect(promise).rejects.toThrow();
  });
});
