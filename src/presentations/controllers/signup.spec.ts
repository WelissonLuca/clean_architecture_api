import { MissingParamError } from '../errors/missingParamError';
import { SignupController } from './signup';

const makeSut = (): SignupController => {
  return new SignupController();
};

describe('Signup Controller', () => {
  it('should return for handle if no name is provided', () => {
    const sut = makeSut();

    const httpRequest = {
      body: {
        email: 'any email',
        password: 'any password',
        passwordConfirmation: 'any password confirmation',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('should return for handle if no email is provided', () => {
    const sut = new SignupController();

    const httpRequest = {
      body: {
        name: 'any name',
        password: 'any password',
        passwordConfirmation: 'any password confirmation',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('should return for handle if no password is provided', () => {
    const sut = new SignupController();

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any email',
        passwordConfirmation: 'any password confirmation',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('should return for handle if no passwordConfirmation is provided', () => {
    const sut = new SignupController();

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any email',
        password: 'any password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });
});
