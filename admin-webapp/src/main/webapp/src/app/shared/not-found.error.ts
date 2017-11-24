export class NotFoundError extends Error {

  constructor(public message: string = null) {
    super(message);
    this.name = 'NotFoundError';
    this.stack = (<any>new Error()).stack;
  }

}
