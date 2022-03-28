import { ILogErrorRepository } from '@data/protocols/db/log/log-error-repository';
import { mockLogErrorRepository } from '@data/test';
import { mockAccountModel } from '@domain/test';
import { serverError, ok } from '@presentations/helpers/http/http';
import {
  IController,
  HttpRequest,
  HttpResponse,
} from '@presentations/protocols';

import { LogControllerDecorator } from './log-controller-decorator';

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: IController;
  logErrorRepositoryStub: ILogErrorRepository;
};

const makeController = (): IController => {
  class ControllerStub implements IController {
    async handle(): Promise<HttpResponse> {
      const httpResponse: HttpResponse = ok(mockAccountModel());
      return Promise.resolve(httpResponse);
    }
  }
  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = mockLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any@gmail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeFakeServer = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  const error = serverError(fakeError);

  return error;
};

describe('Logger Controller Decorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    await sut.handle(mockRequest());

    expect(handleSpy).toHaveBeenCalledWith(mockRequest());
  });

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(mockAccountModel()));
  });

  it('should call logErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(makeFakeServer()));

    await sut.handle(mockRequest());

    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
