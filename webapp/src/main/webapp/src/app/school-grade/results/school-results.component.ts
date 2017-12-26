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
import { Angulartics2 } from "angulartics2";
import { AssessmentsComponent } from "../../assessments/assessments.component";
import { TranslateService } from "@ngx-translate/core";
import { CsvExportService } from "../../csv-export/csv-export.service";
import { SchoolGradeDownloadComponent } from "../../report/school-grade-report-download.component";
import { Option, Utils } from "@sbac/rdw-reporting-common-ngx";
import { OrganizationService } from "../organization.service";

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
  schoolOptions: Option[] = [];
  schoolIsAvailable: boolean = true;

  availableGrades: Grade[];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  gradesAreUnavailable: boolean;

  private _currentSchool: School;
  private _currentGrade: Grade;
  private _currentSchoolYear: number;

  /**
   * The currently selected school
   |  */
  get currentSchool(): School {
    return this._currentSchool;
  }

  set currentSchool(value: School) {
    this._currentSchool = value;

    if (!Utils.isNullOrUndefined(value)) {
      this.assessmentProvider.schoolId = value.id;
      this.assessmentProvider.schoolName = value.name;
    }
  }

  /**
   * The currently selected grade.
   * @returns {Grade}
   */
  get currentGrade(): Grade {
    return this._currentGrade;
  }

  set currentGrade(value: Grade) {
    this._currentGrade = value;
    if (!Utils.isNullOrUndefined(value)) {
      this.assessmentProvider.grade = value;
    }
  }

  /**
   * The currently selected school year.
   * @returns {number}
   */
  get currentSchoolYear(): number {
    return this._currentSchoolYear;
  }

  set currentSchoolYear(value: number) {
    this._currentSchoolYear = value;
    this.assessmentProvider.schoolYear = value;
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private filterOptionService: ExamFilterOptionsService,
              private schoolService: SchoolService,
              private angulartics2: Angulartics2,
              private csvExportService: CsvExportService,
              private translate: TranslateService,
              public assessmentProvider: SchoolAssessmentService,
              private organizationService: OrganizationService) {
  }

  ngOnInit() {
    this.schools = this.route.snapshot.data[ "user" ].schools;
    let schoolId = Number.parseInt(this.route.snapshot.params[ "schoolId" ]);

    // get schools with districts
    this.organizationService.getSchoolsWithDistricts()
      .subscribe(schools => {
        this.schoolOptions = schools.map(school => <Option>{
          label: school.name,
          group: school.districtName,
          value: school
        });
        this.currentSchool = schools.find(x => x.id == schoolId);
        this.schoolIsAvailable = this.currentSchool !== undefined;
      });

    this.filterOptionService
      .getExamFilterOptions()
      .subscribe(filterOptions => {
        this.filterOptions = filterOptions;
        this.currentSchoolYear = this.mapParamsToSchoolYear(this.route.snapshot.params);
      });

    this.schoolService
      .findGradesWithAssessmentsForSchool(schoolId)
      .subscribe(grades => {
        this.availableGrades = grades;
        this.gradesAreUnavailable = this.availableGrades.length == 0;
        this.currentGrade = this.availableGrades.find(grade => grade.id == this.route.snapshot.params[ "gradeId" ]);
      });

    this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
  }

  updateAssessment(latestAssessment: AssessmentExam): void {
    this.assessmentExams = [];

    if (latestAssessment) {
      this.assessmentExams.push(latestAssessment);
    }
  }

  schoolSelectChanged(school: School): void {
    if (school instanceof Event) {
      return;
    }
    if (school && school.id) {
      this.currentSchool = school;

      this.schoolService
        .findGradesWithAssessmentsForSchool(this.currentSchool.id)
        .subscribe(grades => {
          this.availableGrades = grades;
          this.gradesAreUnavailable = this.availableGrades.length == 0;

          if (grades.length > 0) {
            let grade = Utils.isNullOrUndefined(this.currentGrade)
              ? undefined
              : this.availableGrades.find(grade => grade.id == this.currentGrade.id);

            // Try and keep the same grade selected, if it's available.
            this.currentGrade = Utils.isNullOrUndefined(grade)
              ? grades[ 0 ]
              : grade;
            this.updateRoute('School');
          } else {
            this.currentGrade = undefined;
            this.assessmentExams = [];
            this.gradesAreUnavailable = true;
          }
        });
    } else {
      this.currentGrade = undefined;
      this.assessmentExams = [];
      this.gradesAreUnavailable = true;
    }
  }

  updateRoute(changedFilter: string): void {
    let params: any = {};
    params.schoolYear = this.currentSchoolYear;

    if (!Utils.isNullOrUndefined(this.currentGrade)) {
      params.gradeId = this.currentGrade.id;
    }

    this.router.navigate([ 'schools', this.currentSchool.id, params ]).then(() => {
      this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
    });

    this.trackAnalyticsEvent(changedFilter);
  }

  mapParamsToSchoolYear(params): number {
    return Number.parseInt(params[ "schoolYear" ]) || this.filterOptions.schoolYears[ 0 ];
  }

  exportCsv(): void {
    let filename: string = this._currentSchool.name +
      "-" + this.translate.instant(`labels.grades.${this._currentGrade.code}.short-name`) +
      "-" + new Date().toDateString();

    this.angulartics2.eventTrack.next({
      action: 'Export School/Grade Results',
      properties: {
        category: 'Export'
      }
    });

    this.csvExportService.exportAssessmentExams(this.assessmentsComponent.assessmentExams, this.assessmentsComponent.clientFilterBy, this.filterOptions.ethnicities, filename);
  }

  private trackAnalyticsEvent(changedFilter: string): void {
    this.angulartics2.eventTrack.next({
      action: 'Change' + changedFilter,
      properties: {
        category: 'AssessmentResults',
        label: this.getAnalyticsEventLabel(changedFilter)
      }
    });
  }

  private getAnalyticsEventLabel(changedFilter: string): string | number {
    switch (changedFilter) {
      case 'Year':
        return this.currentSchoolYear;
      case 'Grade':
        return this.currentGrade.code;
      case 'School':
        return this.currentSchool.name;
    }
    return undefined;
  }

  /**
   * Initializes SchoolGradeDownloadComponent options with the currently selected filters
   *
   * @param downloader
   */
  private initializeDownloader(downloader: SchoolGradeDownloadComponent): void {
    downloader.title = this.translate.instant('labels.reports.form.title.multiple', {
      name: this._currentSchool.name + ' ' + this.translate.instant(`labels.grades.${this._currentGrade.code}.short-name`)
    });
    downloader.options.schoolYear = this.currentSchoolYear;
  }

}
