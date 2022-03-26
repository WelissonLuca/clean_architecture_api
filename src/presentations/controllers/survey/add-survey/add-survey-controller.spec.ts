import mockDate from 'mockdate';

import { throwError } from '@domain/test';
import {
  badRequest,
  noContent,
  serverError,
} from '@presentations//helpers/http/http';
import { mockAddSurveyStub } from '@presentations/test';
import { mockValidation } from '@validation/test';

import { AddSurveyController } from './add-survey-controller';
import {
  HttpRequest,
  IValidation,
  IAddSurvey,
} from './add-survey-controller-protocols';

type SutTypes = {
  sut: AddSurveyController;
  validationStub: IValidation;
  addSurveyStub: IAddSurvey;
};

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const addSurveyStub = mockAddSurveyStub();
  const sut = new AddSurveyController(validationStub, addSurveyStub);
  return {
    sut,
    validationStub,
    addSurveyStub,
  };
};

const mockRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  },
});
describe('AddSurvey Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });
  it('should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    await sut.handle(mockRequest());

    expect(validateSpy).toHaveBeenCalledWith(mockRequest().body);
  });

  it('should return 400 with validation fails', async () => {
    const { sut, validationStub } = makeSut();

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  it('should call add survey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut();

    const addSpy = jest.spyOn(addSurveyStub, 'add');

    await sut.handle(mockRequest());

    expect(addSpy).toHaveBeenCalledWith(mockRequest().body);
  });

  it('should return 500 if add survey throws', async () => {
    const { sut, addSurveyStub } = makeSut();

    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 204 on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(noContent());
  });
});
