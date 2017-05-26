export class User {
  private _firstName : string;
  private _lastName : string;
  private _permissions : string[];

  constructor(){
    this._permissions = [];
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get permissions(): string[] {
    return this._permissions;
  }

  set permissions(value: string[]) {
    this._permissions = value;
  }
}
