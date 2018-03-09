import { Component } from "@angular/core";
import { School } from "../school-grade/school";
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

  formGroup: FormGroup;
  schoolOptions: Option[];
  schoolHasGradesWithResults: boolean = true;

  private _gradeOptions: Grade[] = [];

  constructor(private schoolService: SchoolService,
              private organizationService: OrganizationService,
              private router: Router) {

    this.formGroup = new FormGroup({
      school: new FormControl({ value: undefined }, Validators.required),
      grade: new FormControl({ value: undefined, disabled: true }, Validators.required)
    })
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
    this.organizationService.getSchoolsWithDistricts()
      .subscribe(schools => {
        this.schoolOptions = schools.map(school => <Option>{
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
