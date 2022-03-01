import bcrypt from 'bcryptjs';

import { BcryptAdapter } from './bcrypter-adapter';

jest.mock('bcryptjs', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('any_hash'));
  },
  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct values', async () => {
    jest.spyOn(bcrypt, 'hash');

    const sut = makeSut();

    await sut.hash('any_value');

    expect(bcrypt.hash).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a valid hash on hash success', async () => {
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

  test('Should call compare if correct values', async () => {
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    const sut = makeSut();
    await sut.compare('any_value', 'any_hash');

    expect(bcrypt.compare).toHaveBeenCalledWith('any_value', 'any_hash');
  });
});
