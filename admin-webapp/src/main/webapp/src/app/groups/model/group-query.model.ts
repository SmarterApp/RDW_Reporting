import { School } from "./school.model";

export class GroupQuery {
  school: School;
  schoolYear: number;
  subject: string;

  get availableSubjects() {
    return this._availableSubjects;
  }

  private _availableSubjects: string[];

  constructor(availableSubjects: string[]){
    this._availableSubjects = availableSubjects;
  }
}
