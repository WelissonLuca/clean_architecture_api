import { AccountModel } from '../../../domain/models/account';
import { IDecrypter } from '../../protocols/cripthografy/decrypter';
import { ILoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository';
import { DbLoadAccountByToken } from './db-load-account-by-token';

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrypterStub: IDecrypter;
  loadAccountByTokenRepository: ILoadAccountByTokenRepository;
};

const makeFakeAccount = (): AccountModel => ({
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
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByTokenRepositoryStub();
};

const makeSut = (): SutTypes => {
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

  test('Should return null if load account by token repository return null', async () => {
    const { sut, loadAccountByTokenRepository } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepository, 'loadByToken')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.load('any_token', 'any_role');
    expect(account).toEqual(makeFakeAccount());
  });
  test('Should throw if decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut();
    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.load('any_token', 'any_role');

    expect(promise).rejects.toThrow();
  });

  test('Should throw if load account repository by token throws', async () => {
    const { sut, loadAccountByTokenRepository } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepository, 'loadByToken')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.load('any_token', 'any_role');

    expect(promise).rejects.toThrow();
  });
});
