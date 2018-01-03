import { FilterBy } from "../../assessments/model/filter-by.model";

export class UpdateQueryFilterBy extends FilterBy {

  _subject: any = -1
  _showValueAs: boolean = false;
  _assessmentGrade: any = -1;
  _achievementLevels: boolean = false;
  _schoolYears: boolean[] = [ false ];

  constructor() {
    super();
    this.administration = 'SD';
    this.summativeStatus = 'Valid';
    this.completion = 'Complete';
    // why does this work and other methods do not??
    this.schoolYears[2018] = true;
  }

  set subject(value: any[]) {
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

  set assessmentGrade(value: any[]) {
    this._assessmentGrade = value;
    this.notifyChange('assessmentGrade');
  }

  get assessmentGrade() {
    return this._assessmentGrade;
  }

  set achievementLevels(value: boolean) {
    this._achievementLevels = value;
    this.notifyChange('achievementLevels');
  }

  get achievementLevels(): boolean {
    return this._achievementLevels;
  }

  set schoolYears(value: boolean[]) {
    this._schoolYears = value;
    this.notifyChange('schoolYears');
  }

  get schoolYears(): boolean[] {
    return this._schoolYears;
  }

}
