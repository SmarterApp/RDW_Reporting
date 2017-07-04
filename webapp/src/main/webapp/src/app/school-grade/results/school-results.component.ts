import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AssessmentExam } from "../../assessments/model/assessment-exam.model";
import { ExamFilterOptions } from "../../assessments/model/exam-filter-options.model";
import { Assessment } from "../../assessments/model/assessment.model";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { SchoolAssessmentService } from "./school-assessment.service";
import { School } from "../../user/model/school.model";
import { SchoolService } from "../school.service";
import { Grade } from "../grade.model";
import { isNullOrUndefined } from "util";

@Component({
  selector: 'app-group-results',
  templateUrl: './school-results.component.html',
})
/**
 * The component which displays the assessment results when
 * searching by school and grade.
 */
export class SchoolResultsComponent implements OnInit {
  schools: School[];
  assessmentExams: AssessmentExam[] = [];
  availableAssessments: Assessment[] = [];
  availableSchools: any[];

  availableGrades: Grade[];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  gradesAreUnavailable: boolean;

  private _currentSchool: School;
  private _currentGrade: Grade;
  private _currentSchoolYear: number;

  /**
   * The currently selected school
|  */
  get currentSchool() {
    return this._currentSchool;
  }

  set currentSchool(value) {
    this._currentSchool = value;

    if(!isNullOrUndefined(value))
      this.assessmentProvider.schoolId = value.id;
  }

  /**
   * The currently selected grade.
   * @returns {Grade}
   */
  get currentGrade() {
    return this._currentGrade;
  }

  set currentGrade(value: Grade) {
    this._currentGrade = value;

    if(!isNullOrUndefined(value))
      this.assessmentProvider.gradeId = value.id;
  }

  /**
   * The currently selected school year.
   * @returns {number}
   */
  get currentSchoolYear() {
    return this._currentSchoolYear;
  }

  set currentSchoolYear(value) {
    this._currentSchoolYear = value;
    this.assessmentProvider.schoolYear = value;
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private filterOptionService: ExamFilterOptionsService,
              private schoolService: SchoolService,
              public assessmentProvider: SchoolAssessmentService) {
  }

  ngOnInit() {
    this.schools = this.route.snapshot.data[ "user" ].schools;
    this.availableSchools = this.schools.map(school => {
      return {
        label: school.name,
        value: school
      };
    });

    let schoolId = this.route.snapshot.params[ "schoolId" ];

    this.currentSchool = this.schools.find(x => x.id == schoolId);

    this.filterOptionService
      .getExamFilterOptions()
      .subscribe(filterOptions => {
        this.filterOptions = filterOptions;
        this.currentSchoolYear = this.mapParamsToSchoolYear(this.route.snapshot.params);
      });

    this.schoolService
      .findGradesWithAssessmentsForSchool(this.currentSchool)
      .subscribe(grades => {
        this.availableGrades = grades;
        this.gradesAreUnavailable = this.availableGrades.length == 0;

        this.currentGrade = this.availableGrades.find(grade => grade.id == this.route.snapshot.params[ "gradeId" ]);
      });

    this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
  }

  updateAssessment(latestAssessment) {
    this.assessmentExams = [];

    if (latestAssessment) {
      this.assessmentExams.push(latestAssessment);
    }
  }

  schoolSelectChanged(){
    this.schoolService
      .findGradesWithAssessmentsForSchool(this.currentSchool)
      .subscribe(grades => {
        this.availableGrades = grades;
        this.gradesAreUnavailable = this.availableGrades.length == 0;

        if(grades.length > 0){
          let grade = isNullOrUndefined(this.currentGrade)
            ? undefined
            : this.availableGrades.find(grade => grade.id == this.currentGrade.id);

          // Try and keep the same grade selected, if it's available.
          this.currentGrade = isNullOrUndefined(grade)
            ? grades[0]
            : grade;
        }
        else
          this.currentGrade = undefined;

        this.updateRoute();
      });
  }

  updateRoute() {
    let params: any = {};
    params.schoolYear = this.currentSchoolYear;

    if(!isNullOrUndefined(this.currentGrade))
      params.gradeId = this.currentGrade.id;

    this.router.navigate(['schools', this.currentSchool.id, params ]).then(() => {
      this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
    });
  }

  mapParamsToSchoolYear(params) {
    return Number.parseInt(params[ "schoolYear" ]) || this.filterOptions.schoolYears[ 0 ];
  }
}
