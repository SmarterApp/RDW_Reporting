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
  private _genders: boolean[] = [ true ];
  private _migrantStatus: number = -1;
  private _plan504: number = -1;
  private _iep: number = -1;
  private _limitedEnglishProficiency: number = -1;
  private _ethnicities: boolean[] = [ true ];
  private _elasCodes: boolean[] = [ true ];

  private _filters = ['offGradeAssessment', 'transferAssessment', 'administration', 'summativeStatus', 'completion', 'genders', 'migrantStatus',
                      'plan504', 'iep', 'limitedEnglishProficiency', 'elasCodes', 'ethnicities'];

  get filteredEthnicities(): any[] {
    return this.filterArray(this._ethnicities);
  }

  get filteredGenders(): any[] {
    return this.filterArray(this._genders);
  }

  get filteredElasCodes(): any[] {
    return this.filterArray(this._elasCodes);
  }

  private filterArray(array: any[]): any[] {
    const returnArray: any[] = [];
    for (const i in array) {
      if (array.hasOwnProperty(i) && i != "0" && array[ i ]) {
        returnArray.push(i);
      }
    }

    return returnArray;
  }

  get all(): string[] {
    const all = [];

    for (const property of this._filters) {
      if (property == "ethnicities") {
        const filteredEthnicities = this.filteredEthnicities;
        for (const filteredEthnicity of filteredEthnicities) {
          all.push(property + "." + filteredEthnicity);
        }
      } else if (property == "genders") {
        const filteredGenders = this.filteredGenders;
        for (const filteredGender of filteredGenders) {
          all.push(property + "." + filteredGender);
        }
      } else if (property == "elasCodes") {
        const filteredElasCodes = this.filteredElasCodes;
        for (const filteredElasCode of filteredElasCodes) {
          all.push(property + "." + filteredElasCode);
        }
      } else if (this.isFilterEnabled(property)) {
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

  get elasCodes(): boolean[] {
    return this._elasCodes;
  }

  set elasCodes(value: boolean[]) {
    this._elasCodes = value;
    this.notifyChange('elasCodes');
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

  get genders(): boolean[] {
    return this._genders;
  }

  set genders(value: boolean[]) {
    this._genders = value;
    this.notifyChange('genders');
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

  get limitedEnglishProficiency(): number {
    return this._limitedEnglishProficiency;
  }

  set limitedEnglishProficiency(value: number) {
    this._limitedEnglishProficiency = value;
    this.notifyChange('limitedEnglishProficiency');
  }

  private isFilterEnabled(property) {
    if (property == "offGradeAssessment" && this[ property ] === false)
      return false;
    else if (property == "transferAssessment" && this[ property ] === false)
      return false;
    else
      return this[ property ] != -1;
  }
}
