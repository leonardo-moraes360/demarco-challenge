export interface Hasher {
  hash(data: string | Buffer): string;
}

export interface Verifier {
  verify(data: string | Buffer, hash: string): boolean;
}
