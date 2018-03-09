import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { StudentExamHistory } from "../model/student-exam-history.model";
import { StudentResultsFilterState } from "./model/student-results-filter-state.model";
import { StudentHistoryExamWrapper } from "../model/student-history-exam-wrapper.model";
import { AssessmentType } from "../../shared/enum/assessment-type.enum";
import { ExamFilterService } from "../../assessments/filters/exam-filters/exam-filter.service";
import { ColorService } from "../../shared/color.service";
import { ExamFilterOptions } from "../../assessments/model/exam-filter-options.model";
import { Student } from "../model/student.model";
import { CsvExportService } from "../../csv-export/csv-export.service";
import { Angulartics2 } from "angulartics2";
import { StudentReportDownloadComponent } from "../../report/student-report-download.component";
import { AssessmentSubjectType } from "../../shared/enum/assessment-subject-type.enum";
import { Utils } from "../../shared/support/support";
import { ReportingEmbargoService } from "../../shared/embargo/reporting-embargo.service";
import { ApplicationSettingsService } from '../../app-settings.service';

@Component({
  selector: 'student-results',
  templateUrl: './student-results.component.html'
})
export class StudentResultsComponent implements OnInit {

  examHistory: StudentExamHistory;
  filterState: StudentResultsFilterState = new StudentResultsFilterState();
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  examsByTypeAndSubject: Map<AssessmentType, Map<string, StudentHistoryExamWrapper[]>> = new Map();
  displayState: any = {};
  minimumItemDataYear: number;
  hasResults: boolean;
  exportDisabled: boolean = true;

  private typeDisplayOrder: AssessmentType[] = [ AssessmentType.IAB, AssessmentType.ICA, AssessmentType.SUMMATIVE ];

  get assessmentTypes(): AssessmentType[] {
    return Array.from(this.examsByTypeAndSubject.keys())
      .sort((a, b) => {
        let aIdx = this.typeDisplayOrder.indexOf(a);
        let bIdx = this.typeDisplayOrder.indexOf(b);
        return aIdx - bIdx;
      });
  }

  constructor(public colorService: ColorService,
              private csvExportService: CsvExportService,
              private route: ActivatedRoute,
              private router: Router,
              private angulartics2: Angulartics2,
              private applicationSettingsService: ApplicationSettingsService,
              private examFilterService: ExamFilterService,
              private embargoService: ReportingEmbargoService) {
  }

  ngOnInit(): void {
    this.examHistory = this.route.snapshot.data[ "examHistory" ];

    if (this.examHistory) {
      this.initializeFilter(this.examHistory.exams, this.route.snapshot.params);
      this.applyFilter();
    }

    this.applicationSettingsService.getSettings().subscribe(settings => {
      this.minimumItemDataYear = settings.minItemDataYear;
    });

    this.embargoService.isEmbargoed().subscribe(
      embargoed => {
        this.exportDisabled = embargoed;
      }
    );
  }

  /**
   * Retrieve an ordered list of subjects available for the given assessment type.
   *
   * @param type  An assessment type
   * @returns {Array<string>} The ordered list of subjects available
   */
  getSubjectsForType(type: AssessmentType): string[] {
    return Array.from(this.examsByTypeAndSubject.get(type).keys())
      .sort((a, b) => a.localeCompare(b));
  }

  /**
   * Handle a filter state change.
   */
  onFilterChange(): void {
    if (this.hasBasicFilterChanged()) {
      this.updateRoute();
    }

    this.applyFilter();
  }

  hasBasicFilterChanged(): boolean {
    let params: any = this.route.snapshot.params;

    return this.filterState.schoolYear != params.schoolYear
      || this.filterState.subject != params.subject;
  }

  isCollapsed(assessmentType: AssessmentType, subject: string): boolean {
    return this.displayState[ assessmentType ][ subject ].collapsed;
  }

  toggleCollapsed(assessmentType: AssessmentType, subject: string): void {
    this.displayState[ assessmentType ][ subject ].collapsed = !this.displayState[ assessmentType ][ subject ].collapsed;
  }

  exportCsv(): void {
    let student: Student = this.examHistory.student;
    let filename: string = student.lastName +
      "-" + student.firstName +
      "-" + student.ssid +
      "-" + new Date().toDateString();

    let sourceData: StudentHistoryExamWrapper[] = [];
    Array.from(this.examsByTypeAndSubject.values()).forEach(bySubject => {
      Array.from(bySubject.values()).forEach(wrappers => {
        sourceData = sourceData.concat(wrappers);
      });
    });

    this.angulartics2.eventTrack.next({
      action: 'Export Student Exam History',
      properties: {
        category: 'Export'
      }
    });

    this.csvExportService.exportStudentHistory(sourceData, () => this.examHistory.student, filename);
  }

  /**
   * Apply the current filter state to the exams.
   */
  private applyFilter(): void {
    let filteredExams: StudentHistoryExamWrapper[] = this.examHistory.exams
      .filter((wrapper) => this.isExamVisible(wrapper));

    filteredExams = this.examFilterService.filterItems(
      (wrapper) => wrapper.assessment,
      (wrapper) => wrapper.exam,
      filteredExams,
      this.filterState.filterBy
    );

    this.hasResults = filteredExams.length != 0;

    let examsByTypeAndSubject: Map<AssessmentType, Map<string, StudentHistoryExamWrapper[]>> = new Map();
    filteredExams.forEach((wrapper) => {
      let type: AssessmentType = wrapper.assessment.type;
      let subject: string = wrapper.assessment.subject;
      let byType: Map<string, StudentHistoryExamWrapper[]> = examsByTypeAndSubject.get(type) || new Map();
      let bySubject: StudentHistoryExamWrapper[] = byType.get(subject) || [];
      bySubject.push(wrapper);
      byType.set(subject, bySubject);
      examsByTypeAndSubject.set(type, byType);

      // Initialize collapse state if it doesn't exist
      this.displayState[ type ] = this.displayState[ type ] || {};
      this.displayState[ type ][ subject ] = this.displayState[ type ][ subject ] || {};
      this.displayState[ type ][ subject ].collapsed = this.displayState[ type ][ subject ].collapsed || false;

      // check for at least one interim or summative while already going thru the exams
      if (wrapper.assessment.isSummative) {
        this.filterOptions.hasSummative = true;
      }
      if (wrapper.assessment.isInterim) {
        this.filterOptions.hasInterim = true;
      }

    });

    this.examsByTypeAndSubject = examsByTypeAndSubject;
  }

  /**
   * Filter an exam by the current filter state.
   *
   * @param wrapper The exam wrapper to filter
   * @returns {boolean} True if the exam should be visible
   */
  private isExamVisible(wrapper: StudentHistoryExamWrapper): boolean {
    // School Year filter
    if (this.filterState.schoolYear > 0) {
      if (wrapper.exam.schoolYear !== this.filterState.schoolYear) {
        return false;
      }
    }
    // Subject filter
    if (this.filterState.subject) {
      if (wrapper.assessment.subject !== this.filterState.subject) {
        return false;
      }
    }

    return true;
  }

  /**
   * Update the current route based upon the current filter state.
   * TODO Do not re-load the page or re-fetch data.
   */
  private updateRoute(): void {
    let params: any = {};
    if (this.filterState.schoolYear > 0) {
      params.schoolYear = this.filterState.schoolYear.toString();
    }
    if (this.filterState.subject) {
      params.subject = this.filterState.subject;
    }

    let navigationExtras = this.route.parent.parent.snapshot.url.length > 0
      ? { relativeTo: this.route.parent.parent }
      : undefined;

    this.router.navigate([ 'students', this.examHistory.student.id, params ], navigationExtras);
  }

  /**
   * Initialize the current filter state from the initial request.
   *
   * @param exams       The available exams
   * @param params      The route params
   */
  private initializeFilter(exams: StudentHistoryExamWrapper[], params: Params): void {

    let years: number[] = [];
    let subjects: string[] = [];

    //Parse available years and subjects from exam history
    exams
      .forEach((exam: StudentHistoryExamWrapper) => {
        years.push(exam.exam.schoolYear);
        subjects.push(exam.assessment.subject)
      });

    //Reduce years to ordered unique list
    this.filterState.years = years
      .sort((a: number, b: number) => b - a)
      .filter((year: number, idx: number, array: number[]) => idx == 0 || year != array[ idx - 1 ]);

    if (params[ "schoolYear" ]) {
      this.filterState.schoolYear = parseInt(params[ 'schoolYear' ]);
    }

    //Reduce subjects to ordered unique list
    this.filterState.subjects = subjects
      .sort((a: string, b: string) => a.localeCompare(b))
      .filter((subject: string, idx: number, array: string[]) => idx == 0 || subject != array[ idx - 1 ]);

    if (params[ "subject" ]) {
      this.filterState.subject = params[ 'subject' ];
    }
  }

  /**
   * Initializes StudentReportDownloadComponent options with the currently selected filters
   *
   * @param downloader
   */
  initializeDownloader(downloader: StudentReportDownloadComponent): void {
    if (this.filterState.schoolYear != 0) {
      downloader.options.schoolYear = this.filterState.schoolYear;
    }
    downloader.options.subject = this.filterState.subject !== ''
      ? Utils.toSubjectCode(AssessmentSubjectType[ this.filterState.subject ])
      : undefined;
  }

}
