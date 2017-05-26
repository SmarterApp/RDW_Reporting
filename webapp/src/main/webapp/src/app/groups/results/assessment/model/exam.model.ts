export class Exam {
  private _studentName : string;
  private _date : Date;
  private _session : string;
  private _enrolledGrade: number;
  private _score : number;
  private _level : number;
  private _administrativeCondition: number;
  private _completeness : number;

  get studentName(): string {
    return this._studentName;
  }

  set studentName(value: string) {
    this._studentName = value;
  }

  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
  }

  get session(): string {
    return this._session;
  }

  set session(value: string) {
    this._session = value;
  }

  get enrolledGrade(): number {
    return this._enrolledGrade;
  }

  set enrolledGrade(value: number) {
    this._enrolledGrade = value;
  }

  get score(): number {
    return this._score;
  }

  set score(value: number) {
    this._score = value;
  }

  get level(): number {
    return this._level;
  }

  set level(value: number) {
    this._level = value;
  }

  get administrativeCondition(): number {
    return this._administrativeCondition;
  }

  set administrativeCondition(value: number) {
    this._administrativeCondition = value;
  }

  get completeness(): number {
    return this._completeness;
  }

  set completeness(value: number) {
    this._completeness = value;
  }
}
