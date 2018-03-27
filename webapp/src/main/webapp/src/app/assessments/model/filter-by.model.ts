import { ObservableObject } from "../../shared/observable-object.model";

export class FilterBy extends ObservableObject {
  // Test
  private _offGradeAssessment: boolean = false;
  private _transferAssessment: boolean = false;

  // Status
  private _administration: any = -1;
  private _summativeStatus: any = -1;
  private _completion: any = -1;

  //Student
  private _gender: any = -1;
  private _migrantStatus: number = -1;
  private _plan504: number = -1;
  private _iep: number = -1;
  private _economicDisadvantage: number = -1;
  private _limitedEnglishProficiency: number = -1;
  private _englishLanguageAcquisitionStatus: number = -1;
  private _ethnicities: boolean[] = [ true ];

  private _filters = ['offGradeAssessment', 'transferAssessment', 'administration', 'summativeStatus', 'completion', 'gender', 'migrantStatus',
                      'plan504', 'iep', 'economicDisadvantage', 'englishLanguageAcquisitionStatus', 'limitedEnglishProficiency', 'ethnicities'];

  get filteredEthnicities() {
    let ethnicities = [];

    for(let i in this._ethnicities) {
      if(this._ethnicities.hasOwnProperty(i) && i != "0" && this._ethnicities[i]) {
        ethnicities.push(i);
      }
    }

    return ethnicities;
  }

  get all(): string[] {
    let all = [];

    for (let property of this._filters) {
        if (property == "ethnicities") {
          let filteredEthnicities = this.filteredEthnicities;
          for (let i of filteredEthnicities) {
            all.push(property + "." + i );
          }
        }
        else if (this.isFilterEnabled(property)) {
          all.push(property);
        }
    }

    return all;
  }

  get ethnicities(): boolean[] {
    return this._ethnicities;
  }

  set ethnicities(value: boolean[]) {
    this._ethnicities = value;
    this.notifyChange('ethnicities');
  }

  get offGradeAssessment(): boolean {
    return this._offGradeAssessment;
  }

  set offGradeAssessment(value: boolean) {
    this._offGradeAssessment = value;
    this.notifyChange('offGradeAssessment');
  }

  get transferAssessment(): boolean {
    return this._transferAssessment;
  }

  set transferAssessment(value: boolean) {
    this._transferAssessment = value;
    this.notifyChange('transferAssessment');
  }

  get administration(): any {
    return this._administration;
  }

  set administration(value: any) {
    this._administration = value;
    this.notifyChange('administration');
  }

  get summativeStatus(): any {
    return this._summativeStatus;
  }

  set summativeStatus(value: any) {
    this._summativeStatus = value;
    this.notifyChange('summativeStatus');
  }

  get completion(): any {
    return this._completion;
  }

  set completion(value: any) {
    this._completion = value;
    this.notifyChange('completion');
  }

  get gender(): any {
    return this._gender;
  }

  set gender(value: any) {
    this._gender = value;
    this.notifyChange('gender');
  }

  get migrantStatus(): number {
    return this._migrantStatus;
  }

  set migrantStatus(value: number) {
    this._migrantStatus = value;
    this.notifyChange('migrantStatus');
  }

  get plan504(): number {
    return this._plan504;
  }

  set plan504(value: number) {
    this._plan504 = value;
    this.notifyChange('plan504');
  }

  get iep(): number {
    return this._iep;
  }

  set iep(value: number) {
    this._iep = value;
    this.notifyChange('iep');
  }

  get economicDisadvantage(): number {
    return this._economicDisadvantage;
  }

  set economicDisadvantage(value: number) {
    this._economicDisadvantage = value;
    this.notifyChange('economicDisadvantage');
  }

  get limitedEnglishProficiency(): number {
    return this._limitedEnglishProficiency;
  }

  set limitedEnglishProficiency(value: number) {
    this._limitedEnglishProficiency = value;
    this.notifyChange('limitedEnglishProficiency');
  }

  get englishLanguageAcquisitionStatus(): number {
    return this._englishLanguageAcquisitionStatus;
  }

  set englishLanguageAcquisitionStatus(value: number) {
    this._englishLanguageAcquisitionStatus = value;
    this.notifyChange('englishLanguageAcquisitionStatus');
  }

  private isFilterEnabled(property) {
    if(property == "offGradeAssessment" && this[ property ] === false)
      return false;
    else if (property == "transferAssessment" && this[ property ] === false)
      return false;
    else
      return this[property] != -1;
  }
}
