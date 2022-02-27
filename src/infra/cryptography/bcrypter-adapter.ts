import bcrypt from 'bcrypt';

import { IEncrypter } from '../../data/protocols/cripthografy/hasher';

export class BcryptAdapter implements IEncrypter {
  private readonly salt: number;
  constructor(salt: number) {
    this.salt = salt;
  }
  async hasher(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);

    return new Promise((resolve) => resolve(hash));
  }
}
