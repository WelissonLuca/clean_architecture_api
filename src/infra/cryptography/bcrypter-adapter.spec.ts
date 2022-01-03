import bcrypt from 'bcrypt';

import { BcryptAdapter } from './bcrypter-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('any_hash'));
  },
}));

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);

    jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('any_value');

    expect(bcrypt.hash).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a hash on success', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);

    const hash = await sut.encrypt('any_value');

    expect(hash).toBe('any_hash');
  });
});
