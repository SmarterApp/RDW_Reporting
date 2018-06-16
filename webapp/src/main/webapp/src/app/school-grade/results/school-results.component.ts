import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentExam } from '../../assessments/model/assessment-exam.model';
import { ExamFilterOptions } from '../../assessments/model/exam-filter-options.model';
import { Assessment } from '../../assessments/model/assessment.model';
import { ExamFilterOptionsService } from '../../assessments/filters/exam-filters/exam-filter-options.service';
import { SchoolAssessmentService } from './school-assessment.service';
import { SchoolService } from '../school.service';
import { Grade } from '../grade.model';
import { Angulartics2 } from 'angulartics2';
import { AssessmentsComponent } from '../../assessments/assessments.component';
import { TranslateService } from '@ngx-translate/core';
import { CsvExportService } from '../../csv-export/csv-export.service';
import { SchoolGradeDownloadComponent } from '../../report/school-grade-report-download.component';
import { Option } from '../../shared/form/sb-typeahead.component';
import { Utils } from '../../shared/support/support';
import { SchoolAssessmentExportService } from './school-assessment-export.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { School } from '../../shared/organization/organization';
import { OrganizationService } from '../../shared/organization/organization.service';
import { SchoolService as CommonSchoolService } from '../../shared/school/school.service';
import { Observable } from 'rxjs/Observable';
import { SchoolTypeahead } from '../../shared/school/school-typeahead';
import { map, mergeMap } from 'rxjs/operators';
import { limit } from '../limit';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'school-results',
  templateUrl: './school-results.component.html'
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
  aboveLimit: boolean = false;

  grades: Grade[];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  gradesAreUnavailable: boolean;
  organizations: any[] = [];

  private _schools?: School[];
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
   */
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

  get stateAsNavigationParameters(): any {
    return {
      schoolYear: this.currentSchoolYear != null
        ? this.currentSchoolYear
        : this.route.snapshot.params.schoolYear,
      gradeId: this.currentGrade != null
        ? this.currentGrade.id
        : this.route.snapshot.params.gradeId
    };
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
    forkJoin(
      this.filterOptionService.getExamFilterOptions(),
      this.organizationService.getSchoolsWithDistricts(limit + 1)
    ).subscribe(([ filterOptions, schools ]) => {
      this.filterOptions = filterOptions;
      this.aboveLimit = schools.length <= limit;
      if (!this.aboveLimit) {
        this._schools = schools;
        this.schoolOptions = schools.map(school => <Option>{
          label: school.name,
          group: school.districtName,
          value: school
        });
      } else {
        this.schoolOptions = Observable.create(observer => {
          observer.next(this.schoolTypeahead.value);
        }).pipe(
          mergeMap((search: string) =>
            this.organizationService.searchSchoolsWithDistrictsBySchoolName(search).pipe(
              map((schools: School[]) => schools.filter(
                school => this.organizations.findIndex(organization => school.equals(organization)) === -1
              ))
            )
          )
        );
      }

      this.subscribeToRouteChanges();
      this.updateRouteWithDefaultFilters();
    });
  }

  private subscribeToRouteChanges(): void {
    this.route.params.pipe(
      mergeMap(parameters => {
        const { schoolId } = parameters;
        return forkJoin(
          // if we don't have the grades for the school look them up
          !this.grades
            ? this.schoolService.findGradesWithAssessmentsForSchool(schoolId)
            : of(this.grades),
          // if we have don't have the current school look it up
          !this._schools
            ? this.commonSchoolService.getSchool(schoolId)
            : of(this.currentSchool ? this.currentSchool : this._schools.find(({ id }) => schoolId == id)),
          of(parameters)
        ).pipe(
          map(([ grades, school, parameters ]) => <any>{
            ...parameters,
            school,
            grades
          })
        );
      })
    ).subscribe(resolvedParameters => {
      const { schoolYear, gradeId, school, grades } = resolvedParameters;
      this.currentSchoolYear = schoolYear != null ? Number.parseInt(schoolYear) : undefined;
      this.currentSchool = school;
      this.currentGrade = grades.find(grade => grade.id == gradeId) || grades[ 0 ];
      this.grades = grades;
      this.gradesAreUnavailable = grades.length === 0;
    });

    this.route.data.subscribe(({ assessment }) => {
      this.updateAssessment(assessment);
    });

  }

  private updateRouteWithDefaultFilters(): void {
    const { schoolYear } = this.route.snapshot.params;
    if (schoolYear == null) {
      this.currentSchoolYear = this.filterOptions.schoolYears[ 0 ];
      this.updateRoute(true);
    }
  }

  deselectSchool(): void {
    this.currentSchool = null;
  }

  updateAssessment(latestAssessment: AssessmentExam): void {
    this.assessmentExams = latestAssessment ? [ latestAssessment ] : [];
  }

  onSchoolChange(school: School): void {
    if (school instanceof Event) {
      return;
    }
    if (school && school.id) {
      this.currentSchool = school;
      this.trackAnalyticsEvent('School', this.currentSchool.name);

      // we may need to adjust the assessment grade before updating the route so that the correct data is resolved
      this.schoolService.findGradesWithAssessmentsForSchool(school.id)
        .subscribe(grades => {
          this.grades = grades;
          this.gradesAreUnavailable = grades.length === 0;

          const previousGrade = this.currentGrade;
          this.currentGrade = grades.find(grade => grade.id === this.currentGrade.id) || grades[ 0 ];
          if (previousGrade
            && this.currentGrade
            && this.currentGrade.id !== previousGrade.id) {
            this.trackAnalyticsEvent('Grade', this.currentGrade.code);
          }

          this.updateRoute();
        });
    }
  }

  onGradeChange(): void {
    this.trackAnalyticsEvent('Grade', this.currentGrade.code);
    this.updateRoute();
  }

  onSchoolYearChange(): void {
    this.trackAnalyticsEvent('Year', this.currentSchoolYear);
    this.updateRoute();
  }

  private updateRoute(replaceUrl: boolean = false): void {
    const schoolId = this.currentSchool ? this.currentSchool.id : this.route.snapshot.params.schoolId;
    this.router.navigate(
      [ 'schools', schoolId, this.stateAsNavigationParameters ],
      { replaceUrl }
    );
  }

  exportCsv(): void {

    this.angulartics2.eventTrack.next({
      action: 'Export School/Grade Results',
      properties: {
        category: 'Export'
      }
    });

    const gradeLabel = this.translate.instant(`common.assessment-grade-short-label.${this._currentGrade.code}`);
    this.csvExportService.exportAssessmentExams(
      this.assessmentsComponent.assessmentExams,
      this.assessmentsComponent.clientFilterBy,
      this.filterOptions.ethnicities,
      `${this._currentSchool.name}-${gradeLabel}-${new Date().toDateString()}`
    );
  }

  private trackAnalyticsEvent(source: string, label: any): void {
    this.angulartics2.eventTrack.next({
      action: 'Change' + source,
      properties: {
        category: 'AssessmentResults',
        label: label
      }
    });
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
