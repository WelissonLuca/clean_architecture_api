import { IEncrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

interface ISutTypes {
  sut: DbAddAccount;
  encrypterStub: IEncrypter;
}
const makeSut = (): ISutTypes => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  const encrypterStub = new EncrypterStub();

  const sut = new DbAddAccount(encrypterStub);

  return {
    sut,
    encrypterStub,
  };
};
describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountDate = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    await sut.add(accountDate);

    expect(encrypterSpy).toHaveBeenCalledWith('valid_password');
  });
});
