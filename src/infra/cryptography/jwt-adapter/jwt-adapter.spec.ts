import jwt from 'jsonwebtoken';

import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise((resolve) => resolve('any_token'));
  },
}));
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

  it('should return a token on signin success', async () => {
    const sut = new JwtAdapter('secret');
    const accessToken = await sut.encrypt('any_id');

    expect(accessToken).toBe('any_token');
  });
});
