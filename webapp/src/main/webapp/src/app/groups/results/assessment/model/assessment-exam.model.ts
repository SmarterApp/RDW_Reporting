import { Assessment } from "./assessment.model";
import { Exam } from "./exam.model";

export class AssessmentExam {
  constructor(){
    this._assessment = new Assessment();
    this._exams = [];
  }

  private _assessment: Assessment;
  private _exams: Exam[]

  get assessment(): Assessment {
    return this._assessment;
  }

  set assessment(value: Assessment) {
    this._assessment = value;
  }

  get exams(): Exam[] {
    return this._exams;
  }

  set exams(value: Exam[]) {
    this._exams = value;
  }
}
