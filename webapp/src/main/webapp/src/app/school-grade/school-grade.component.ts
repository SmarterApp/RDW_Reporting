import { Component, Input } from "@angular/core";
import { School } from "../user/model/school.model";
import { SchoolService } from "./school.service";
import { Grade } from "./grade.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { OrganizationService } from "./organization.service";
import { Option } from "../shared/form/sb-typeahead.component";
import { Utils } from "../shared/support/support";

/**
 * This component is responsible for displaying a search widget allowing
 * users to find assessments by school and grade.
 */
@Component({
  selector: 'school-grade',
  templateUrl: './school-grade.component.html'
})
export class SchoolGradeComponent {

  searchForm: FormGroup = new FormGroup({
    school: new FormControl({ value: undefined }, Validators.required),
    grade: new FormControl({ value: undefined, disabled: true }, Validators.required)
  });

  private _schools: School[] = [];
  private _schoolOptions: Option[] = [];
  private _gradeOptions: Grade[] = [];
  private _noGradeOptionResults: boolean = false;

  constructor(private schoolService: SchoolService,
              private organizationService: OrganizationService,
              private router: Router) {
  }

  performSearch() {
    if (this.searchForm.valid) {
      this.router.navigate([ 'schools', this.school.id, { gradeId: this.grade.id } ]);
    }
  }

  schoolChanged(value: any) {
    // specifying a type on value of this method does not work for handling events
    // instead, we have to check that this is an instance of what we want  before using the value
    if (value instanceof School) {
      this.school = value;
    }
  }

  get school(): School {
    return this.schoolControl.value;
  }

  @Input()
  set schools(values: School[]) {
    if (this._schools !== values) {
      this._schools = values ? values.concat() : [];
      if (this._schools.length) {
        this.loadSchoolOptions();
      }
    }
  }

  set school(value: School) {
    this.schoolControl.setValue(value);

    // update grades when school changes
    this.gradeControl.disable();
    this.grade = undefined;
    if (!Utils.isNullOrUndefined(value)) {
      this.loadGradeOptions(value);
    }
  }

  get schoolOptions(): Option[] {
    return this._schoolOptions;
  }

  set schoolOptions(values: Option[]) {
    if (this._schoolOptions !== values) {
      this._schoolOptions = values ? values.concat() : [];
      this.school = this._schoolOptions.length == 1
        ? this._schoolOptions[ 0 ].value
        : undefined;
    }
  }

  get grade(): Grade {
    return this.gradeControl.value;
  }

  set grade(value: Grade) {
    this.gradeControl.setValue(value);
  }

  get gradeOptions(): Grade[] {
    return this._gradeOptions;
  }

  set gradeOptions(values: Grade[]) {
    if (this._gradeOptions !== values) {
      this._gradeOptions = values ? values.concat() : [];
      this._noGradeOptionResults = !this._gradeOptions.length;

      if (values.length) {
        this.gradeControl.enable();
      }
      this.grade = values.length == 1
        ? values[ 0 ]
        : undefined;
    }
  }

  get noGradeOptionResults(): boolean {
    return this._noGradeOptionResults;
  }

  private get schoolControl() {
    return this.searchForm.controls[ 'school' ];
  }

  private get gradeControl() {
    return this.searchForm.controls[ 'grade' ];
  }

  private loadSchoolOptions(): void {
    this.organizationService.getSchoolsWithDistricts()
      .subscribe(schools => {
        this._schoolOptions = schools.map(school => <Option>{
          label: school.name,
          group: school.districtName,
          value: school
        });
      });
  }

  private loadGradeOptions(school: School): void {
    this.schoolService.findGradesWithAssessmentsForSchool(school.id)
      .subscribe(grades => {
        this.gradeOptions = grades;
      });
  }
}
