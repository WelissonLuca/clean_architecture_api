import { hash, compare } from 'bcrypt';

import { IHashCompare } from '../../../data/protocols/cripthografy/hash-compare';
import { IHasher } from '../../../data/protocols/cripthografy/hasher';

export class BcryptAdapter implements IHasher, IHashCompare {
  private readonly salt: number;
  constructor(salt: number) {
    this.salt = salt;
  }
  async hash(value: string): Promise<string> {
    const hasher = await hash(value, this.salt);

    return new Promise((resolve) => resolve(hasher));
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isvalid = await compare(value, hash);

    if (!isvalid) {
      return new Promise((resolve) => resolve(false));
    }

    return new Promise((resolve) => resolve(true));
  }
}
