import { mockDecrypter, mockLoadAccountByTokenRepository } from '@data/test';
import { mockAccountModel, throwError } from '@domain/test';

import { DbLoadAccountByToken } from './db-load-account-by-token';
import {
  IDecrypter,
  ILoadAccountByTokenRepository,
} from './db-load-account-by-token-protocols';

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrypterStub: IDecrypter;
  loadAccountByTokenRepository: ILoadAccountByTokenRepository;
};

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter();
  const loadAccountByTokenRepository = mockLoadAccountByTokenRepository();
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
      .mockReturnValueOnce(Promise.resolve(null));

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
      .mockReturnValueOnce(Promise.resolve(null));
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.load('any_token', 'any_role');
    expect(account).toEqual(mockAccountModel());
  });
  test('Should throw if decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(throwError);

    const promise = sut.load('any_token', 'any_role');

    expect(promise).rejects.toThrow();
  });

  test('Should throw if load account repository by token throws', async () => {
    const { sut, loadAccountByTokenRepository } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepository, 'loadByToken')
      .mockImplementationOnce(throwError);

    const promise = sut.load('any_token', 'any_role');

    expect(promise).rejects.toThrow();
  });
});
