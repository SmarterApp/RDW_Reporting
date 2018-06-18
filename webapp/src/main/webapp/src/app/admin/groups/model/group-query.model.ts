import { School } from "./school.model";

export class GroupQuery {
  school: School;
  schoolYear: number;
  subject: string;

  // TODO:ConfigurableSubjects the service you send the request to should provide this
  // a nicity might even be that the backend fills this in when nothing is sent
  get availableSubjects() {
    return this._availableSubjects;
  }

  private _availableSubjects: string[];

  constructor(availableSubjects: string[]){
    this._availableSubjects = availableSubjects;
  }
}
