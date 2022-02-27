import bcrypt from 'bcrypt';

import { IHasher } from '../../data/protocols/cripthografy/hasher';

export class BcryptAdapter implements IHasher {
  private readonly salt: number;
  constructor(salt: number) {
    this.salt = salt;
  }
  async hasher(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);

    return new Promise((resolve) => resolve(hash));
  }
}
