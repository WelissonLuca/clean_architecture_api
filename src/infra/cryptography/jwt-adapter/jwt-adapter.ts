import { sign } from 'jsonwebtoken';

import { IEncrypter } from '../../../data/protocols/cripthografy/encrypter';

export class JwtAdapter implements IEncrypter {
  constructor(private readonly secret: string) {}
  async encrypt(value: string): Promise<string> {
    const token = await sign({ id: value }, this.secret);

    return token;
  }
}
