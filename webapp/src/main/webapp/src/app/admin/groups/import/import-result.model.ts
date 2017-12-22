export class ImportResult {
  id: number;
  digest: string;
  message: string;
  created: Date;
  updated: Date;
  status: string;
  fileName: string;

  get isOk(): boolean {
    return this.status === 'ACCEPTED' || this.status === 'PROCESSED';
  }
}

