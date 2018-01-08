import { FilterBy } from "../../assessments/model/filter-by.model";
import { AssessmentSubjectType } from "../../shared/enum/assessment-subject-type.enum";

export class QueryBuilderFilterBy extends FilterBy {

  _subject: AssessmentSubjectType = -1;
  _showValueAs: boolean = false;
  _assessmentGrade: Map<any, boolean> = new Map<any, boolean>();
  _achievementLevels: boolean = false;
  _schoolYears: Map<any, boolean> = new Map<any, boolean>();

  constructor() {
    super();
    this.administration = 'SD';
    this.summativeStatus = 'Valid';
    this.completion = 'Complete';
    this.schoolYears [ '2017-18' ] = true;
    this.assessmentGrade [ '0' ] = true;

  }

  set subject(value: AssessmentSubjectType) {
    this._subject = value;
    this.notifyChange('subject');
  }

  get subject() {
    return this._subject;
  }

  set showValueAs(value: boolean) {
    this._showValueAs = value;
    this.notifyChange('showValueAs');
  }

  get showValueAs(): boolean {
    return this._showValueAs;
  }

  set assessmentGrade(value: Map<any, boolean>) {
    this._assessmentGrade = value;
    this.notifyChange('assessmentGrade');
  }

  get assessmentGrade() {
    return this._assessmentGrade;
  }

  getAssessmentGrades(): Array<any> {
    let array: Array<any> = [];
    let assessmentGrades = this.assessmentGrade;
    for (let val in assessmentGrades) {
      if (assessmentGrades[ val ]) array.push(val);
    }

    return array;
  }

  set achievementLevels(value: boolean) {
    this._achievementLevels = value;
    this.notifyChange('achievementLevels');
  }

  get achievementLevels(): boolean {
    return this._achievementLevels;
  }

  set schoolYears(value: Map<any, boolean>) {
    this._schoolYears = value;
    this.notifyChange('schoolYears');
  }

  get schoolYears(): Map<any, boolean> {
    return this._schoolYears;
  }

  getSchoolYears(): Array<any> {
    let array: Array<any> = [];
    let schoolYears = this.schoolYears;
    for (let schoolYear in schoolYears) {
      if (schoolYears[ schoolYear ]) array.push(schoolYear);
    }

    return array;
  }

}
