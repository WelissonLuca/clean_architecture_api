import { AddSurveyController } from './add-survey-controller';
import { IHttpRequest, IValidation } from './add-survey-controller-protocols';

interface ISutTypes {
  sut: AddSurveyController;
  validationStub: IValidation;
}

const makeValidation = (): IValidation => {
  class ValidationStub {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};
const makeSut = (): ISutTypes => {
  const validationStub = makeValidation();
  const sut = new AddSurveyController(validationStub);
  return {
    sut,
    validationStub,
  };
};

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
  },
});
describe('AddSurvey Controller', () => {
  it('should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    await sut.handle(makeFakeRequest());

    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body);
  });
});
