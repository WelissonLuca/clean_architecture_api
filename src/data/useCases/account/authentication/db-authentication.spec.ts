import {
  mockEncrypter,
  mockHashCompare,
  mockLoadAccountByEmailRepository,
  mockUpdateAcessTokenRepositoryStub,
} from '@data/test';
import { mockAuthentication } from '@domain/test';

import { throwError } from '../../../../domain/test/test-helpers';
import { DbAuthentication } from './db-authentcation';
import {
  IHashCompare,
  ILoadAccountByEmailRepository,
  IEncrypter,
  IUpdateAcessTokenRepository,
} from './db-authentication-protocols';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
  hashCompareStub: IHashCompare;
  encrypterStub: IEncrypter;
  updateAcessTokenRepositoryStub: IUpdateAcessTokenRepository;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const hashCompareStub = mockHashCompare();
  const encrypterStub = mockEncrypter();
  const updateAcessTokenRepositoryStub = mockUpdateAcessTokenRepositoryStub();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAcessTokenRepositoryStub
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAcessTokenRepositoryStub,
  };
};
describe('DbAuthentication', () => {
  it('should call load account by email repository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    await sut.auth(mockAuthentication());

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should throw if load account by email repository throws', () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthentication());

    expect(promise).rejects.toThrow();
  });

  it('should return null if load by email repository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null);
    const httpResponse = await sut.auth(mockAuthentication());

    expect(httpResponse).toBeNull();
  });

  it('should call hash compare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut();

    const hashCompareSpy = jest.spyOn(hashCompareStub, 'compare');
    await sut.auth(mockAuthentication());

    expect(hashCompareSpy).toHaveBeenCalledWith('any_password', 'any_password');
  });

  it('should throw if hash compare throws', () => {
    const { sut, hashCompareStub } = makeSut();

    jest.spyOn(hashCompareStub, 'compare').mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthentication());

    expect(promise).rejects.toThrow();
  });

  it('should return null if hash compare returns false', async () => {
    const { sut, hashCompareStub } = makeSut();

    jest
      .spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(false)));

    const httpResponse = await sut.auth(mockAuthentication());

    expect(httpResponse).toBeNull();
  });

  it('should call token generator with correct id', async () => {
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    await sut.auth(mockAuthentication());

    expect(encryptSpy).toHaveBeenCalledWith('any_id');
  });

  it('should throw if token generator throws', () => {
    const { sut, encrypterStub } = makeSut();

    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthentication());

    expect(promise).rejects.toThrow();
  });

  it('should call token generator with correct id', async () => {
    const { sut } = makeSut();

    const acessToken = await sut.auth(mockAuthentication());

    expect(acessToken).toBe('any_token');
  });

  it('should call update acess token repository with correct values', async () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut();

    const updateSpy = jest.spyOn(
      updateAcessTokenRepositoryStub,
      'updateAccessToken'
    );

    await sut.auth(mockAuthentication());

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  it('should throw if update acess token repository throws', () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut();

    jest
      .spyOn(updateAcessTokenRepositoryStub, 'updateAccessToken')
      .mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthentication());

    expect(promise).rejects.toThrow();
  });
});
