import { IDecrypter } from '../../protocols/cripthografy/decrypter';
import { DbLoadAccountByToken } from './db-load-account-by-token';

interface ISutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: IDecrypter;
}
const makeDecrypter = (): IDecrypter => {
  class DecrypterStub implements IDecrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('any_value'));
    }
  }

  return new DecrypterStub();
};

const makeSut = (): ISutTypes => {
  const decrypterStub = makeDecrypter();
  const sut = new DbLoadAccountByToken(decrypterStub);
  return {
    sut,
    decrypterStub,
  };
};

describe('DbLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');

    await sut.load('any_token');

    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  test('Should return null if decrypter return null', async () => {
    const { sut, decrypterStub } = makeSut();

    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const account = await sut.load('any_token');

    expect(account).toBeNull();
  });
});
