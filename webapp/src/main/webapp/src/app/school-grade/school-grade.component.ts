import { Component, OnInit, Input } from "@angular/core";
import { School } from "../user/model/school.model";
import { SchoolService } from "./school.service";
import { isNullOrUndefined } from "util";
import { Grade } from "./grade.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

/**
 * This component is responsible for displaying a search widget allowing
 * users to find assessments by school and grade.
 */
@Component({
  selector: 'school-grade',
  templateUrl: './school-grade.component.html'
})
export class SchoolGradeComponent implements OnInit {
  /**
   * The array of available schools a user has
   * access to.
   * @type {Array}
   */
  @Input()
  set availableSchools(schools: School[]) {
    this._availableSchools = schools.map(school => {
      return {
        label: school.name,
        value: school
      };
    });
  }

  get availableSchools() {
    return this._availableSchools;
  }

  searchForm: FormGroup;
  selectNullOptionValue: any = null;

  availableGrades: Grade[] = [];
  gradesAreUnavailable: boolean = false;

  private _availableSchools: any[] = [];

  constructor(private schoolService: SchoolService, private router: Router) {
    this.availableGrades = [];
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      school: new FormControl(null, Validators.required),
      grade: new FormControl({ value: this.selectNullOptionValue, disabled: true }, Validators.required)
    });

    if(this._availableSchools.length == 1){
      let school = this._availableSchools[0].value;

      this.schoolControl.setValue(school);
      this.schoolChanged(school);
    }

    this.schoolControl.valueChanges.subscribe(school => this.schoolChanged(school));
  }

  performSearch() {
    if(this.searchForm.valid) {
      this.router.navigate([ 'schools', this.schoolControl.value.id, { gradeId: this.gradeControl.value.id } ]);
    }
  }

  private get gradeControl() {
    return this.searchForm.controls[ "grade" ];
  }

  private get schoolControl() {
    return this.searchForm.controls[ "school" ];
  }

  private schoolChanged(school: School) {
    this.availableGrades = [];
    this.gradesAreUnavailable = false;

    this.gradeControl.disable();

    if (!isNullOrUndefined(school)) {
      this.loadAvailableGrades(school);
    }
  }

  private loadAvailableGrades(school: School) {
    this.schoolService
      .findGradesWithAssessmentsForSchool(school)
      .subscribe(grades => {
        this.availableGrades = grades;
        this.gradesAreUnavailable = grades.length == 0;

        if (!this.gradesAreUnavailable)
          this.gradeControl.enable();

        if (grades.length == 1) {
          this.gradeControl.setValue(grades[ 0 ]);
        }
        else {
          this.gradeControl.setValue(this.selectNullOptionValue);
        }
      });
  }
}
