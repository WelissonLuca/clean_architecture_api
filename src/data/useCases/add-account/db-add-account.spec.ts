import { DbAddAccount } from './db-add-account';
import {
  IAccountModel,
  IAddAccountModel,
  IHasher,
  IAddAccountRepository,
} from './db-add-account-protocols';

interface ISutTypes {
  sut: DbAddAccount;
  hasherStub: IHasher;
  addAccountRepositoryStub: IAddAccountRepository;
}

const makeHasher = (): IHasher => {
  class HasherStub implements IHasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }

  return new HasherStub();
};

const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password',
});

const makeAccountData = (): IAddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(accountData: IAddAccountModel): Promise<IAccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new AddAccountRepositoryStub();
};
const makeSut = (): ISutTypes => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();

  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub);

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
  };
};
describe('DbAddAccount UseCase', () => {
  test('Should call hash with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, 'hash');

    await sut.add(makeAccountData());

    expect(hasherSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw if hash throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest
      .spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.add(makeAccountData());

    expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    await sut.add(makeAccountData());

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password',
    });
  });

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.add(makeAccountData());

    expect(promise).rejects.toThrow();
  });

  test('Should return an account on sucess', async () => {
    const { sut } = makeSut();

    const account = await sut.add(makeAccountData());

    expect(account).toEqual(makeFakeAccount());
  });
});
