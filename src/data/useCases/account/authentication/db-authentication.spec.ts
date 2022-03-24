import { DbAuthentication } from './db-authentcation';
import {
  AccountModel,
  IAuthenticationModel,
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
const makeFakeAccount = (): AccountModel =>
  ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password',
  } as AccountModel);

const makeFakeAuthentication = (): IAuthenticationModel =>
  ({
    email: 'any_email@mail.com',
    password: 'any_password',
  } as IAuthenticationModel);

const makeHashCompare = (): IHashCompare => {
  class HashCompareStub implements IHashCompare {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }

  return new HashCompareStub();
};
const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements ILoadAccountByEmailRepository
  {
    async loadByEmail(email: string): Promise<AccountModel> {
      const account: AccountModel = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      };
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }

  return new EncrypterStub();
};

const makeupdateAcessTokenRepositoryStub = (): IUpdateAcessTokenRepository => {
  class UpdateAcessTokenRepositoryStub implements IUpdateAcessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new UpdateAcessTokenRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashCompareStub = makeHashCompare();
  const encrypterStub = makeEncrypter();
  const updateAcessTokenRepositoryStub = makeupdateAcessTokenRepositoryStub();
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

    await sut.auth(makeFakeAuthentication());

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should throw if load account by email repository throws', () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.auth(makeFakeAuthentication());

    expect(promise).rejects.toThrow();
  });

  it('should return null if load by email repository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null);
    const httpResponse = await sut.auth(makeFakeAuthentication());

    expect(httpResponse).toBeNull();
  });

  it('should call hash compare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut();

    const hashCompareSpy = jest.spyOn(hashCompareStub, 'compare');
    await sut.auth(makeFakeAuthentication());

    expect(hashCompareSpy).toHaveBeenCalledWith(
      'any_password',
      'hashed_password'
    );
  });

  it('should throw if hash compare throws', () => {
    const { sut, hashCompareStub } = makeSut();

    jest
      .spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.auth(makeFakeAuthentication());

    expect(promise).rejects.toThrow();
  });

  it('should return null if hash compare returns false', async () => {
    const { sut, hashCompareStub } = makeSut();

    jest
      .spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(false)));

    const httpResponse = await sut.auth(makeFakeAuthentication());

    expect(httpResponse).toBeNull();
  });

  it('should call token generator with correct id', async () => {
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    await sut.auth(makeFakeAuthentication());

    expect(encryptSpy).toHaveBeenCalledWith('any_id');
  });

  it('should throw if token generator throws', () => {
    const { sut, encrypterStub } = makeSut();

    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.auth(makeFakeAuthentication());

    expect(promise).rejects.toThrow();
  });

  it('should call token generator with correct id', async () => {
    const { sut } = makeSut();

    const acessToken = await sut.auth(makeFakeAuthentication());

    expect(acessToken).toBe('any_token');
  });

  it('should call update acess token repository with correct values', async () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut();

    const updateSpy = jest.spyOn(
      updateAcessTokenRepositoryStub,
      'updateAccessToken'
    );

    await sut.auth(makeFakeAuthentication());

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  it('should throw if update acess token repository throws', () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut();

    jest
      .spyOn(updateAcessTokenRepositoryStub, 'updateAccessToken')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.auth(makeFakeAuthentication());

    expect(promise).rejects.toThrow();
  });
});