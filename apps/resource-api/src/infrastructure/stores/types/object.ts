export interface ObjectStorer {
  getPreSignedUrl(ids: string[], name: string): Promise<string>;

  save(ids: string[], name: string, data: any): Promise<void>;

  delete(ids: string[], name: string): Promise<void>;
}
