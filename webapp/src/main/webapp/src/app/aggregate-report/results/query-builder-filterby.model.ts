import { FilterBy } from "../../assessments/model/filter-by.model";

export class QueryBuilderFilterBy extends FilterBy {

  _subject: any = -1
  _showValueAs: boolean = false;
  _assessmentGrade: any = -1;
  _achievementLevels: boolean = false;
  _schoolYears: Map<any, boolean> = new Map<any, boolean>();

  constructor() {
    super();
    this.administration = 'SD';
    this.summativeStatus = 'Valid';
    this.completion = 'Complete';
    this.schoolYears ['2017-18'] = true;

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

  set schoolYears(value: Map<any, boolean>) {
    this._schoolYears = value;
    this.notifyChange('schoolYears');
  }

  get schoolYears(): Map<any, boolean> {
    return this._schoolYears;
  }

}
