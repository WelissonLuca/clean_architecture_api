import bcrypt from 'bcrypt';

import { BcryptAdapter } from './bcrypter-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('any_hash'));
  },
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    jest.spyOn(bcrypt, 'hash');

    const sut = makeSut();

    await sut.hash('any_value');

    expect(bcrypt.hash).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a hash on success', async () => {
    const sut = makeSut();

    const hash = await sut.hash('any_value');

    expect(hash).toBe('any_hash');
  });

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut();

    jest
      .spyOn(bcrypt, 'hash')
      .mockRejectedValue(new Error('any_error') as never);

    const promise = sut.hash('any_value');

    expect(promise).rejects.toThrow();
  });
});
