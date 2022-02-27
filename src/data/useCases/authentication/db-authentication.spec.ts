import { IAuthenticationModel } from '../../../domain/useCases/authentication';
import { IHashCompare } from '../../protocols/cripthografy/hash-compare';
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { IAccountModel } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentcation';

interface ISutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
  hashCompareStub: IHashCompare;
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

const makeSut = (): ISutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashCompareStub = makeHashCompare();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
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
});
