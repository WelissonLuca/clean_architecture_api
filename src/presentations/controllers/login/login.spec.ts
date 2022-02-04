import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http';
import { LoginController } from './login';

interface ISutTypes {
  sut: LoginController;
}
const makeSut = (): ISutTypes => {
  const sut = new LoginController();
  return {
    sut,
  };
};
describe('Login Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
