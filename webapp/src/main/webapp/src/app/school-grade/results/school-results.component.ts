import { Component, OnInit, ViewChild } from "@angular/core";
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
import { Angulartics2 } from "angulartics2";
import { AssessmentsComponent } from "../../assessments/assessments.component";
import { TranslateService } from "@ngx-translate/core";
import { CsvExportService } from "../../csv-export/csv-export.service";

@Component({
  selector: 'app-group-results',
  templateUrl: './school-results.component.html',
})
/**
 * The component which displays the assessment results when
 * searching by school and grade.
 */
export class SchoolResultsComponent implements OnInit {

  @ViewChild(AssessmentsComponent)
  assessmentsComponent: AssessmentsComponent;

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
              private angulartics2: Angulartics2,
              private csvExportService: CsvExportService,
              private translateService: TranslateService,
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

        this.updateRoute('School');
      });
  }

  updateRoute(changedFilter: string) {
    let params: any = {};
    params.schoolYear = this.currentSchoolYear;

    if(!isNullOrUndefined(this.currentGrade))
      params.gradeId = this.currentGrade.id;

    this.router.navigate(['schools', this.currentSchool.id, params ]).then(() => {
      this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
    });

    this.trackAnalyticsEvent(changedFilter);
  }

  mapParamsToSchoolYear(params) {
    return Number.parseInt(params[ "schoolYear" ]) || this.filterOptions.schoolYears[ 0 ];
  }

  exportCsv(): void {
    let filename: string = this._currentSchool.name +
      "-" + this.translateService.instant(`labels.grades.${this._currentGrade.code}.short-name`) +
      "-" + new Date().toDateString();

    this.csvExportService.exportAssessmentExams(this.assessmentsComponent.assessmentExams, this.assessmentsComponent.clientFilterBy, filename);
  }

  private trackAnalyticsEvent(changedFilter: string) {
    let details: any;

    switch (changedFilter) {
      case 'Year':
        details = this.currentSchoolYear;
        break;
      case 'Grade':
        details = this.currentGrade.code;
        break;
      case 'School':
        details = this.currentSchool.name;
        break;
    }

    this.angulartics2.eventTrack.next({
      action: 'Change' + changedFilter,
      properties: {
        category: 'AssessmentResults',
        label: details
      }
    });
  }
}
