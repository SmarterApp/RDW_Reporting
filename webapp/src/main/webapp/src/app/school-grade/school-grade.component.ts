import { Component, ViewChild } from "@angular/core";
import { SchoolService } from "./school.service";
import { Grade } from "./grade.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Option } from "../shared/form/sb-typeahead.component";
import { Utils } from "../shared/support/support";
import { School } from "../shared/organization/organization";
import { Observable } from "rxjs/Observable";
import { SchoolTypeahead } from "../shared/organization/school-typeahead";
import { OrganizationService } from "../shared/organization/organization.service";
import { mergeMap } from "rxjs/operators";

const toggleLimit = 3;

/**
 * This component is responsible for displaying a search widget allowing
 * users to find assessments by school and grade.
 */
@Component({
  selector: 'school-grade',
  templateUrl: './school-grade.component.html'
})
export class SchoolGradeComponent {

  formGroup: FormGroup;
  schoolOptions: Option[] | Observable<School[]>;
  private schoolCount;
  private _aboveLimit: boolean = false;
  schoolHasGradesWithResults: boolean = true;

  /**
   * The school typeahead
   */
  @ViewChild('schoolTypeahead')
  schoolTypeahead: SchoolTypeahead;

  private _gradeOptions: Grade[] = [];
  organizations: any[] = [];

  constructor(private schoolService: SchoolService,
              private organizationService: OrganizationService,
              private router: Router) {

    this.formGroup = new FormGroup({
      school: new FormControl({ value: undefined }, Validators.required),
      grade: new FormControl({ value: undefined, disabled: true }, Validators.required)
    });
    this.schoolOptions = Observable.create(observer => {
      observer.next(this.schoolTypeahead.value);
    }).pipe(
      mergeMap(
        (search: string) =>
          this.organizationService.searchSchoolsWithDistrictsBySchoolName(search)
            .map(
              (organizations: any[]) =>
                organizations.filter(
                  organization => this.organizations.findIndex(x => organization.equals(x)) === -1
                ))
      ));
  }

  ngOnInit(): void {
    this.loadSchoolOptions();
  }

  submit() {
    if (this.formGroup.valid) {
      this.router.navigate([ 'schools', this.school.id, { gradeId: this.grade.id } ]);
    }
  }

  schoolChanged(value: any) {
    this.school = value;
  }

  unSelectSchool(value: any) {
    this.school = null;
  }

  get aboveLimit() {
    return this.schoolCount > toggleLimit;
  }

  get school(): School {
    return this.schoolControl.value;
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
      this.schoolHasGradesWithResults = this._gradeOptions.length > 0;

      if (values.length) {
        this.gradeControl.enable();
      }

      this.grade = values.length == 1
        ? values[ 0 ]
        : undefined;
    }
  }

  private get schoolControl(): FormControl {
    return <FormControl>this.formGroup.controls[ 'school' ];
  }

  private get gradeControl(): FormControl {
    return <FormControl>this.formGroup.controls[ 'grade' ];
  }

  private loadSchoolOptions(): void {
    this.organizationService.getSchoolCount().subscribe(count => {
      this.schoolCount = count;
      if (!this.aboveLimit) {
        this.organizationService.getSchoolsWithDistricts()
          .subscribe(schools => {
            this.schoolOptions = schools.map(school => <Option>{
              label: school.name,
              group: school.districtName,
              value: school
            });
          });
      }
    });

  }

  private loadGradeOptions(school: School): void {
    this.schoolService.findGradesWithAssessmentsForSchool(school.id)
      .subscribe(grades => {
        this.gradeOptions = grades;
      });
  }

}
