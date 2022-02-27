import { IAuthenticationModel } from '../../../domain/useCases/authentication';
import { IHashCompare } from '../../protocols/cripthografy/hash-compare';
import { ITokenGenerator } from '../../protocols/cripthografy/token-generator';
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { IUpdateAcessTokenRepository } from '../../protocols/db/uodate-acess-token-repository';
import { IAccountModel } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentcation';

interface ISutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
  hashCompareStub: IHashCompare;
  tokenGeneratorStub: ITokenGenerator;
  updateAcessTokenRepositoryStub: IUpdateAcessTokenRepository;
}
const makeFakeAccount = (): IAccountModel =>
  ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password',
  } as IAccountModel);

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
    async load(email: string): Promise<IAccountModel> {
      const account: IAccountModel = {
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

const makeTokenGenerator = (): ITokenGenerator => {
  class TokenGeneratorStub implements ITokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }

  return new TokenGeneratorStub();
};

const makeupdateAcessTokenRepositoryStub = (): IUpdateAcessTokenRepository => {
  class UpdateAcessTokenRepositoryStub implements IUpdateAcessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new UpdateAcessTokenRepositoryStub();
};

const makeSut = (): ISutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashCompareStub = makeHashCompare();
  const tokenGeneratorStub = makeTokenGenerator();
  const updateAcessTokenRepositoryStub = makeupdateAcessTokenRepositoryStub();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAcessTokenRepositoryStub
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAcessTokenRepositoryStub,
  };
};
describe('DbAuthentication', () => {
  it('should call load account by email repository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    await sut.auth(makeFakeAuthentication());

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should throw if load account by email repository throws', () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.auth(makeFakeAuthentication());

    expect(promise).rejects.toThrow();
  });

  it('should return null if load by email repository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
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
    const { sut, tokenGeneratorStub } = makeSut();

    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');

    await sut.auth(makeFakeAuthentication());

    expect(generateSpy).toHaveBeenCalledWith('any_id');
  });

  it('should throw if token generator throws', () => {
    const { sut, tokenGeneratorStub } = makeSut();

    jest
      .spyOn(tokenGeneratorStub, 'generate')
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

    const updateSpy = jest.spyOn(updateAcessTokenRepositoryStub, 'update');

    await sut.auth(makeFakeAuthentication());

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });
});
