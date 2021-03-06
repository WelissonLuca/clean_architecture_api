import { hash, compare } from 'bcrypt';

import { IHashCompare } from '@data/protocols/cripthografy/hash-compare';
import { IHasher } from '@data/protocols/cripthografy/hasher';

export class BcryptAdapter implements IHasher, IHashCompare {
  constructor(private readonly salt: number) {}
  async hash(value: string): Promise<string> {
    const hasher = await hash(value, this.salt);

    return Promise.resolve(hasher);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isvalid = await compare(value, hash);

    if (!isvalid) {
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  }
}
