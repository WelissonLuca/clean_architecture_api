import bcrypt from 'bcrypt';

import { BcryptAdapter } from './bcrypter-adapter';

jest.mock('bcrypt', () => ({
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
  describe('hash()', () => {
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

    test('Should throw if hash throws', async () => {
      const sut = makeSut();

      jest
        .spyOn(bcrypt, 'hash')
        .mockRejectedValue(new Error('any_error') as never);

      const promise = sut.hash('any_value');

      expect(promise).rejects.toThrow();
    });
  });

  describe('compare()', () => {
    test('Should call compare if correct values', async () => {
      jest.spyOn(bcrypt, 'compare');
      const sut = makeSut();
      await sut.compare('any_value', 'any_hash');

      expect(bcrypt.compare).toHaveBeenCalledWith('any_value', 'any_hash');
    });

    test('Should return true when compare succeeds', async () => {
      const sut = makeSut();
      const isValid = await sut.compare('any_value', 'any_hash');

      expect(isValid).toBeTruthy();
    });

    test('Should return false when compare fails', async () => {
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce();
      const sut = makeSut();
      const isValid = await sut.compare('any_value', 'any_hash');

      expect(isValid).toBeFalsy();
    });

    test('Should throw if compare throws', async () => {
      const sut = makeSut();

      jest
        .spyOn(bcrypt, 'compare')
        .mockRejectedValue(new Error('any_error') as never);

      const promise = sut.compare('any_value', 'any_hash');

      expect(promise).rejects.toThrow();
    });
  });
});
