import { MissingParamError } from '../../errors';
import { ok, badRequest } from '../../helpers/http/http';
import { SignupController } from './signup-controller';
import {
  IAccountModel,
  IAddAccount,
  IAddAccountModel,
  IHttpRequest,
  IValidation,
} from './signup-controller-protocols';

interface ISutTypes {
  sut: SignupController;
  addAccountStub: IAddAccount;
  validationStub: IValidation;
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password',
});

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(account: IAddAccountModel): Promise<IAccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }
  return new AddAccountStub();
};

const makeSut = (): ISutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();

  const sut = new SignupController(addAccountStub, validationStub);

  return {
    sut,
    addAccountStub,
    validationStub,
  };
};

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: 'any name',
    email: 'any email',
    password: 'any password',
    passwordConfirmation: 'any password',
  },
});

describe('Signup Controller', () => {
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();

    const addSpy = jest.spyOn(addAccountStub, 'add');

    await sut.handle(makeFakeRequest());

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any name',
      email: 'any email',
      password: 'any password',
    });
  });

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  it('should return call validation with correct value', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 400 if validation return an error', async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any field'));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any field'))
    );
  });
});
