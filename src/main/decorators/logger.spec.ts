import { ILogErrorRepository } from '../../data/protocols/log-error-repository';
import { serverError } from '../../presentations/helpers/http';
import { IController, IHttpResponse } from '../../presentations/protocols';
import { LogControllerDecorator } from './logger';

interface ISutTypes {
  sut: LogControllerDecorator;
  controllerStub: IController;
  logErrorRepositoryStub: ILogErrorRepository;
}

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async log(stackError: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new LogErrorRepositoryStub();
};

const makeController = (): IController => {
  class ControllerStub implements IController {
    async handle(): Promise<IHttpResponse> {
      const httpResponse: IHttpResponse = {
        statusCode: 200,
        body: {
          name: 'any_name',
          email: 'any@gmail.com',
        },
      };
      return new Promise((resolve) => resolve(httpResponse));
    }
  }
  return new ControllerStub();
};

const makeSut = (): ISutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
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
describe('Logger Controller Decorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@gmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@gmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'any_name',
        email: 'any@gmail.com',
      },
    });
  });

  it('should call logErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    const error = serverError(fakeError);
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(error)));

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@gmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
