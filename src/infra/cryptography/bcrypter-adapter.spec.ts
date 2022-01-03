import bcrypt from 'bcrypt';

import { BcryptAdapter } from './bcrypter-adapter';

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);

    jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('any_value');

    expect(bcrypt.hash).toHaveBeenCalledWith('any_value', salt);
  });
});
