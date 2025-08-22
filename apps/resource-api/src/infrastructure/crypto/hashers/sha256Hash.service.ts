import { createHash } from 'node:crypto';
import { type Hasher, type Verifier } from '../types/hasher';

export class Sha256HashService implements Hasher, Verifier {
  hash(data: string | Buffer): string {
    const hasher = createHash('sha256');

    hasher.update(data);

    return hasher.digest('hex');
  }

  verify(data: string | Buffer, hash: string): boolean {
    const hasher = createHash('sha256');

    hasher.update(data);

    const computedHash = hasher.digest('hex');

    return computedHash === hash;
  }
}
