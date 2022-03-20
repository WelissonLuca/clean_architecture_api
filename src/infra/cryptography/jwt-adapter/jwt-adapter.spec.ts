import jwt from 'jsonwebtoken';

import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise((resolve) => resolve('any_token'));
  },
  async verify(): Promise<string> {
    return new Promise((resolve) => resolve('any_value'));
  },
}));

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret');
};
describe('JwtAdapter', () => {
  describe('sign()', () => {
    it('should call signin with correct values', async () => {
      const sut = makeSut();
      const signinSpy = jest.spyOn(jwt, 'sign');
      await sut.encrypt('any_id');
      expect(signinSpy).toHaveBeenCalledWith(
        {
          id: 'any_id',
        },
        'secret'
      );
    });

    it('should return a token on signin success', async () => {
      const sut = makeSut();
      const accessToken = await sut.encrypt('any_id');

      expect(accessToken).toBe('any_token');
    });

    it('should throw if signin throws', async () => {
      const sut = makeSut();
      jest
        .spyOn(jwt, 'sign')
        .mockImplementationOnce(
          () => new Promise((resolve, reject) => reject(new Error()))
        );
      const promise = sut.encrypt('any_id');

      await expect(promise).rejects.toThrow();
    });
  });

  describe('verify()', () => {
    it('should call verify with correct values', async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');
      await sut.decrypt('any_token');
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
    });

    it('should return a value on verify success', async () => {
      const sut = makeSut();
      const value = await sut.decrypt('any_token');
      expect(value).toBe('any_value');
    });
  });
});
