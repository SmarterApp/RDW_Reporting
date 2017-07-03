export class Student {

  get id(): number {
    return this._id;
  }

  get ssid(): string {
    return this._ssid;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  constructor(
    private _id: number,
    private _ssid: string,
    private _firstName: string,
    private _lastName: string
  ) {}
}
