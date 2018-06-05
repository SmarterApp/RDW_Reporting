import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AssessmentExam } from "../../assessments/model/assessment-exam.model";
import { ExamFilterOptions } from "../../assessments/model/exam-filter-options.model";
import { Assessment } from "../../assessments/model/assessment.model";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { SchoolAssessmentService } from "./school-assessment.service";
import { SchoolService } from "../school.service";
import { Grade } from "../grade.model";
import { Angulartics2 } from "angulartics2";
import { AssessmentsComponent } from "../../assessments/assessments.component";
import { TranslateService } from "@ngx-translate/core";
import { CsvExportService } from "../../csv-export/csv-export.service";
import { SchoolGradeDownloadComponent } from "../../report/school-grade-report-download.component";
import { Option } from "../../shared/form/sb-typeahead.component";
import { Utils } from "../../shared/support/support";
import { SchoolAssessmentExportService } from "./school-assessment-export.service";
import { forkJoin } from 'rxjs/observable/forkJoin';
import { School } from "../../shared/organization/organization";
import { OrganizationService } from "../../shared/organization/organization.service";
import { SchoolService as CommonSchoolService } from "../../shared/school/school.service";
import { Observable } from "rxjs/Observable";
import { SchoolTypeahead } from "../../shared/school/school-typeahead";
import { map, mergeMap } from "rxjs/operators";
import { limit } from "../limit";

@Component({
  selector: 'school-results',
  templateUrl: './school-results.component.html',
})
/**
 * The component which displays the assessment results when
 * searching by school and grade.
 */
export class SchoolResultsComponent implements OnInit {

  @ViewChild(AssessmentsComponent)
  assessmentsComponent: AssessmentsComponent;

  assessmentExams: AssessmentExam[] = [];
  availableAssessments: Assessment[] = [];
  schoolOptions: Option[] | Observable<School[]>;
  schoolIsAvailable: boolean = true;
  aboveLimit: boolean = false;

  availableGrades: Grade[];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  gradesAreUnavailable: boolean;
  organizations: any[] = [];

  private _currentSchool: School;
  private _currentGrade: Grade;
  private _currentSchoolYear: number;

  /**
   * The school typeahead
   */
  @ViewChild('schoolTypeahead')
  schoolTypeahead: SchoolTypeahead;


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
      this.assessmentExporter.schoolId = value.id;
      this.assessmentExporter.schoolName = value.name;
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
      this.assessmentExporter.grade = value;
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
    this.assessmentExporter.schoolYear = value;
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private filterOptionService: ExamFilterOptionsService,
              private schoolService: SchoolService,
              private angulartics2: Angulartics2,
              private csvExportService: CsvExportService,
              private translate: TranslateService,
              public assessmentProvider: SchoolAssessmentService,
              public assessmentExporter: SchoolAssessmentExportService,
              private organizationService: OrganizationService,
              private commonSchoolService: CommonSchoolService) {
  }

  ngOnInit(): void {
    const { schoolId, gradeId, schoolYear } = this.route.snapshot.params;
    const schoolIdParam = Number.parseInt(schoolId);
    const gradeIdParam = Number.parseInt(gradeId);

    this.organizationService.getSchoolsWithDistricts(limit + 1).subscribe((schools: School[]) => {
      if (schools.length <= limit) {
        this.aboveLimit = false;
        forkJoin(
          this.filterOptionService.getExamFilterOptions(),
          this.schoolService.findGradesWithAssessmentsForSchool(schoolIdParam)
        ).subscribe(([ filterOptions, grades ]) => {

          this.schoolOptions = schools.map(school => <Option>{
            label: school.name,
            group: school.districtName,
            value: school
          });
          this.currentSchool = schools.find(x => x.id === schoolIdParam);
          this.initFilterOptionsSchoolYearGrades(filterOptions, schoolYear, grades, gradeIdParam);
        });
      } else {
        this.aboveLimit = true;
        forkJoin(
          this.commonSchoolService.getSchool(schoolIdParam),
          this.filterOptionService.getExamFilterOptions(),
          this.schoolService.findGradesWithAssessmentsForSchool(schoolIdParam)
        ).subscribe(([ school, filterOptions, grades ]) => {
          this.schoolOptions = Observable.create(observer => {
            observer.next(this.schoolTypeahead.value);
          }).pipe(
            mergeMap(
              (search: string) =>
                this.organizationService.searchSchoolsWithDistrictsBySchoolName(search)
                  .pipe(map(
                    (schools: School[]) =>
                      schools.filter(
                        (school: School) => this.organizations.findIndex(x => school.equals(x)) === -1
                      ))
                  )));
          this.currentSchool = school;
          this.initFilterOptionsSchoolYearGrades(filterOptions, schoolYear, grades, gradeIdParam);
        });
      }
    });


    const { assessment } = this.route.snapshot.data;
    this.updateAssessment(assessment);
  }

  private initFilterOptionsSchoolYearGrades(filterOptions: ExamFilterOptions, schoolYear: any, grades: Grade[], gradeIdParam: number) {
    this.schoolIsAvailable = this.currentSchool !== undefined;

    this.filterOptions = filterOptions;
    this.currentSchoolYear = Number.parseInt(schoolYear) || this.filterOptions.schoolYears[ 0 ];

    this.availableGrades = grades;
    this.gradesAreUnavailable = this.availableGrades.length == 0;
    this.currentGrade = this.availableGrades.find(grade => grade.id === gradeIdParam);
  }

  deselectSchool(value: any) {
    this.currentSchool = null;
  }

  updateAssessment(latestAssessment: AssessmentExam): void {
    this.assessmentExams = latestAssessment ? [ latestAssessment ] : [];
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

  exportCsv(): void {
    let filename: string = this._currentSchool.name +
      "-" + this.translate.instant(`common.assessment-grade-short-label.${this._currentGrade.code}`) +
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
  initializeDownloader(downloader: SchoolGradeDownloadComponent): void {
    downloader.title = this.translate.instant('common.reports.form.title.multiple', {
      name: this._currentSchool.name + ' ' + this.translate.instant(`common.assessment-grade-short-label.${this._currentGrade.code}`)
    });
    downloader.options.schoolYear = this.currentSchoolYear;
  }

}
