import jwt from 'jsonwebtoken';

import { JwtAdapter } from './jwt-adapter';

describe('JwtAdapter', () => {
  it('should call signin with correct values', async () => {
    const sut = new JwtAdapter('secret');
    const signinSpy = jest.spyOn(jwt, 'sign');
    await sut.encrypt('any_id');
    expect(signinSpy).toHaveBeenCalledWith(
      {
        id: 'any_id',
      },
      'secret'
    );
  });
});
