import { sign } from 'jsonwebtoken';

import { IDecrypter } from '../../../data/protocols/cripthografy/decrypter';
import { IEncrypter } from '../../../data/protocols/cripthografy/encrypter';

export class JwtAdapter implements IEncrypter, IDecrypter {
  constructor(private readonly secret: string) {}
  async encrypt(value: string): Promise<string> {
    const token = await sign({ id: value }, this.secret);

    return token;
  }

  async decrypt(token: string): Promise<string> {
    const data = await sign({ id: token }, this.secret);

    return data;
  }
}
