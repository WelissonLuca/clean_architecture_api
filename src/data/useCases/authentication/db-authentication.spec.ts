import { IAuthenticationModel } from '../../../domain/useCases/authentication';
import { ILoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { IAccountModel } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentcation';

interface ISutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
}
const makeFakeAccount = (): IAccountModel =>
  ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
  } as IAccountModel);

const makeFakeAuthentication = (): IAuthenticationModel =>
  ({
    email: 'any_email@mail.com',
    password: 'any_password',
  } as IAuthenticationModel);

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
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub,
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
});
