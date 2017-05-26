import { AssessmentType } from "../../../../shared/enum/assessment-type.enum";
export class Assessment {
  private _id : number;
  private _name : string;
  private _grade : number;
  private _type : AssessmentType;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get grade(): number {
    return this._grade;
  }

  set grade(value: number) {
    this._grade = value;
  }

  get type(): AssessmentType {
    return this._type;
  }

  set type(value: AssessmentType) {
    this._type = value;
  }
}
