import { IAccountModel } from '../../../domain/models/account';
import { IDecrypter } from '../../protocols/cripthografy/decrypter';
import { ILoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository';
import { DbLoadAccountByToken } from './db-load-account-by-token';

interface ISutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: IDecrypter;
  loadAccountByTokenRepository: ILoadAccountByTokenRepository;
}

const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password',
});

const makeDecrypter = (): IDecrypter => {
  class DecrypterStub implements IDecrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }

  return new DecrypterStub();
};

const makeLoadAccountByTokenRepository = (): ILoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements ILoadAccountByTokenRepository
  {
    async loadByToken(token: string, role?: string): Promise<IAccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByTokenRepositoryStub();
};

const makeSut = (): ISutTypes => {
  const decrypterStub = makeDecrypter();
  const loadAccountByTokenRepository = makeLoadAccountByTokenRepository();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepository
  );
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepository,
  };
};

describe('DbLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');

    await sut.load('any_token', 'any_role');

    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  test('Should return null if decrypter return null', async () => {
    const { sut, decrypterStub } = makeSut();

    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const account = await sut.load('any_token', 'any_role');

    expect(account).toBeNull();
  });

  test('Should call load account by token repository with correct values', async () => {
    const { sut, loadAccountByTokenRepository } = makeSut();

    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepository,
      'loadByToken'
    );

    await sut.load('any_token', 'any_role');

    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });
});
