import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentExamHistory } from '../model/student-exam-history.model';
import { StudentResultsFilterState } from './model/student-results-filter-state.model';
import { StudentHistoryExamWrapper } from '../model/student-history-exam-wrapper.model';
import { ExamFilterService } from '../../assessments/filters/exam-filters/exam-filter.service';
import { ColorService } from '../../shared/color.service';
import { ExamFilterOptions } from '../../assessments/model/exam-filter-options.model';
import { CsvExportService } from '../../csv-export/csv-export.service';
import { Angulartics2 } from 'angulartics2';
import { StudentReportDownloadComponent } from '../../report/student-report-download.component';
import { ReportingEmbargoService } from '../../shared/embargo/reporting-embargo.service';
import { ApplicationSettingsService } from '../../app-settings.service';
import { AssessmentTypeOrdering } from '../../shared/ordering/orderings';
import { FilterBy } from '../../assessments/model/filter-by.model';
import * as _ from 'lodash';
import { StudentResultsFilterService } from './student-results-filter.service';
import { Student } from '../model/student.model';
import { StudentPipe } from '../../shared/format/student.pipe';
import { OrderingService } from "../../shared/ordering/ordering.service";
import { Ordering } from "@kourge/ordering";

@Component({
  selector: 'student-results',
  templateUrl: './student-results.component.html'
})
export class StudentResultsComponent implements OnInit {

  examHistory: StudentExamHistory;
  sections: Section[] = [];
  filterState: StudentResultsFilterState;
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  advancedFilters: FilterBy = new FilterBy();
  minimumItemDataYear: number;
  hasResults: boolean;
  exportDisabled: boolean = true;

  private _subjectOrdering: Ordering<string>;

  constructor(private colorService: ColorService,
              private csvExportService: CsvExportService,
              private route: ActivatedRoute,
              private router: Router,
              private angulartics2: Angulartics2,
              private applicationSettingsService: ApplicationSettingsService,
              private examFilterService: ExamFilterService,
              private embargoService: ReportingEmbargoService,
              private studentResultsFilterService: StudentResultsFilterService,
              private studentPipe: StudentPipe,
              private orderingService: OrderingService) {
  }

  ngOnInit(): void {

    const { examHistory } = this.route.snapshot.data;
    if (examHistory) {
      this.orderingService.getSubjectOrdering()
        .subscribe(subjectOrdering => {
          this.examHistory = examHistory;
          this._subjectOrdering = subjectOrdering;

          const { exams } = examHistory;
          this.filterState = this.createFilterState(exams);
          this.filterOptions.hasSummative = exams.some(wrapper => wrapper.assessment.isSummative);
          this.filterOptions.hasInterim = exams.some(wrapper => wrapper.assessment.isInterim);
          this.advancedFilters.onChanges.subscribe(property => this.onAdvancedFilterChange());
          this.sections = this.createSections(exams);

          this.subscribeToRouteChanges();
          this.updateRouteWithDefaultFilters();

          this.applicationSettingsService.getSettings().subscribe(settings => {
            this.minimumItemDataYear = settings.minItemDataYear;
          });

          this.embargoService.isEmbargoed().subscribe(embargoed => {
            this.exportDisabled = embargoed;
          });
        });
    }
  }

  getStudent(student: Student): string {
    return this.studentPipe.transform(student, true);
  }

  private subscribeToRouteChanges(): void {
    this.route.params.subscribe(parameters => {
      this.updateFilterState(parameters);
      this.applyFilter();
    });
  }

  private updateRouteWithDefaultFilters(): void {
    const { historySchoolYear } = this.route.snapshot.params;
    if (historySchoolYear == null) {
      this.filterState.schoolYear = this.filterState.schoolYears[ 0 ];
      this.updateRoute(true);
    }
  }

  /**
   * Handle a filter state change.
   */
  onFilterChange(): void {
    this.updateRoute();
  }

  private onAdvancedFilterChange(): void {
    this.applyFilter();
  }

  exportCsv(): void {

    this.angulartics2.eventTrack.next({
      action: 'Export Student Exam History',
      properties: {
        category: 'Export'
      }
    });

    const { student } = this.examHistory;
    this.csvExportService.exportStudentHistory(
      this.sections.reduce((exams, section) => {
        exams.push(...section.filteredExams);
        return exams;
      }, []),
      () => this.examHistory.student,
      `${student.lastName ? student.lastName + '-' : ''}${student.firstName ? student.firstName + '-' : ''}${student.ssid}-${new Date().toDateString()}`
    );
  }

  getAssessmentTypeColor(assessmentType: string): string {
    const index = [ 'ica', 'iab', 'sum' ].indexOf(assessmentType);
    const totalAssessmentTypes = 3;
    const colorIndex = index >= 0 ? index + 1 : totalAssessmentTypes;
    return this.colorService.getColor(colorIndex);
  }

  /**
   * Apply the current filter state to the exams.
   */
  private applyFilter(): void {
    this.studentResultsFilterService.filterChanged();
    const examsFilteredByYearAndSubject = this.examHistory.exams
      .filter(wrapper => {
        const { schoolYear, subject, assessmentType } = this.filterState;
        return (schoolYear == null || schoolYear === wrapper.exam.schoolYear)
          && (subject == null || subject === wrapper.assessment.subject)
          && (assessmentType == null || assessmentType === wrapper.assessment.type);
      });

    const filteredExams = this.examFilterService.filterItems(
      wrapper => wrapper.assessment,
      wrapper => wrapper.exam,
      examsFilteredByYearAndSubject,
      this.advancedFilters
    );

    this.hasResults = filteredExams.length !== 0;
    this.sections.forEach(section => {
      section.filteredExams = section.exams.filter(exam => filteredExams.find(x => x.exam.id === exam.exam.id));
    });
  }

  /**
   * Update the current route based upon the current filter state.
   */
  private updateRoute(replaceUrl: boolean = false): void {
    const parameters: any = {};
    if (this.filterState.schoolYear) {
      parameters.historySchoolYear = this.filterState.schoolYear;
    }
    if (this.filterState.subject) {
      parameters.subject = this.filterState.subject;
    }
    if (this.filterState.assessmentType) {
      parameters.assessmentType = this.filterState.assessmentType;
    }

    // this is needed since the route can be for a group (/groups/1/students/2 or directly to the student (/students/2)
    const navigationExtras = this.route.parent && this.route.parent.parent.snapshot.url.length > 0
      ? { relativeTo: this.route.parent.parent, replaceUrl }
      : { replaceUrl };

    this.router.navigate([
      'students',
      this.examHistory.student.id,
      parameters
    ], navigationExtras);
  }

  private createSections(exams: StudentHistoryExamWrapper[]): Section[] {
    return exams.reduce((sections, wrapper) => {
      const { type, subject } = wrapper.assessment;
      const section = sections.find(section => section.subjectCode === subject);
      if (section) {
        section.exams.push(wrapper);
      } else {
        sections.push({
          assessmentTypeCode: type,
          assessmentTypeColor: this.getAssessmentTypeColor(type),
          subjectCode: subject,
          exams: [ wrapper ],
          filteredExams: [],
          collapsed: false
        });
      }
      return sections;
    }, []).sort(this._subjectOrdering.on<Section>(section => section.subjectCode).compare);
  }

  /**
   * Initialize the current filter state from the initial request.
   *
   * @param exams       The available exams
   * @param params      The route params
   */
  private createFilterState(exams: StudentHistoryExamWrapper[]): StudentResultsFilterState {

    const filterState: StudentResultsFilterState = exams.reduce((filterState, wrapper: StudentHistoryExamWrapper) => {
        const { schoolYear } = wrapper.exam;
        filterState.schoolYears = _.union(filterState.schoolYears, [ schoolYear ]);
        const { subject, type } = wrapper.assessment;
        filterState.subjects = _.union(filterState.subjects, [ subject ]);
        filterState.assessmentTypes = _.union(filterState.assessmentTypes, [ type ]);
        return filterState;
      },
      {
        schoolYears: [],
        subjects: [],
        assessmentTypes: []
      }
    );

    filterState.schoolYears.sort((a, b) => b - a);
    filterState.subjects.sort(this._subjectOrdering.compare);
    filterState.assessmentTypes.sort(AssessmentTypeOrdering.compare);

    return filterState;
  }

  private updateFilterState(parameters: any): void {
    const { historySchoolYear, subject, assessmentType } = parameters;
    const filterState = this.filterState;
    filterState.schoolYear = historySchoolYear != null ? Number.parseInt(historySchoolYear) : undefined;
    filterState.subject = subject;
    filterState.assessmentType = assessmentType;
  }

  /**
   * Initializes StudentReportDownloadComponent options with the currently selected filters
   *
   * @param downloader
   */
  initializeDownloader(downloader: StudentReportDownloadComponent): void {
    downloader.options.schoolYear = this.filterState.schoolYear
      ? this.filterState.schoolYear
      : this.filterState.schoolYears[ 0 ];
    downloader.options.subject = this.filterState.subject;
    downloader.options.assessmentType = this.filterState.assessmentType;
  }

}

/**
 * Represents a page section where exams of a specific type and subject are displayed
 */
interface Section {
  assessmentTypeCode: string;
  assessmentTypeColor: string;
  subjectCode: string;
  exams: StudentHistoryExamWrapper[];
  filteredExams: StudentHistoryExamWrapper[];
  collapsed: boolean;
}
