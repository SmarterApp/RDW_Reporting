import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { StudentExamHistory } from "../model/student-exam-history.model";
import { StudentResultsFilterState } from "./model/student-results-filter-state.model";
import { StudentHistoryExamWrapper } from "../model/student-history-exam-wrapper.model";
import { ExamFilterService } from "../../assessments/filters/exam-filters/exam-filter.service";
import { ColorService } from "../../shared/color.service";
import { ExamFilterOptions } from "../../assessments/model/exam-filter-options.model";
import { CsvExportService } from "../../csv-export/csv-export.service";
import { Angulartics2 } from "angulartics2";
import { StudentReportDownloadComponent } from "../../report/student-report-download.component";
import { ReportingEmbargoService } from "../../shared/embargo/reporting-embargo.service";
import { ApplicationSettingsService } from '../../app-settings.service';
import { AssessmentTypeOrdering, SubjectOrdering } from '../../shared/ordering/orderings';
import { join } from '@kourge/ordering/comparator';
import { FilterBy } from '../../assessments/model/filter-by.model';

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

  constructor(private colorService: ColorService,
              private csvExportService: CsvExportService,
              private route: ActivatedRoute,
              private router: Router,
              private angulartics2: Angulartics2,
              private applicationSettingsService: ApplicationSettingsService,
              private examFilterService: ExamFilterService,
              private embargoService: ReportingEmbargoService) {
  }

  ngOnInit(): void {

    const { examHistory } = this.route.snapshot.data;
    if (examHistory) {
      this.examHistory = examHistory;

      const { exams } = examHistory;
      this.filterState = this.createFilterState(exams, this.route.snapshot.params);
      this.filterOptions.hasSummative = exams.some(wrapper => wrapper.assessment.isSummative);
      this.filterOptions.hasInterim = exams.some(wrapper => wrapper.assessment.isInterim);
      this.advancedFilters.onChanges.subscribe(property => this.onAdvancedFilterChange());
      this.sections = this.createSections(exams);
      this.applyFilter();
    }

    this.applicationSettingsService.getSettings().subscribe(settings => {
      this.minimumItemDataYear = settings.minItemDataYear;
    });

    this.embargoService.isEmbargoed().subscribe(embargoed => {
      this.exportDisabled = embargoed;
    });
  }

  /**
   * Handle a filter state change.
   */
  onFilterChange(): void {
    this.updateRoute();
    this.applyFilter();
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
        exams.push(...section.exams);
        return exams;
      }, []),
      () => this.examHistory.student,
      `${student.lastName}-${student.firstName}-${student.ssid}-${new Date().toDateString()}`
    );
  }

  getAssessmentTypeColor(assessmentType: string) {
    const index = [ 'ica', 'iab', 'sum' ].indexOf(assessmentType);
    const totalAssessmentTypes = 3;
    const colorIndex = index >= 0 ? index + 1 : totalAssessmentTypes;
    return this.colorService.getColor(colorIndex);
  }

  /**
   * Apply the current filter state to the exams.
   */
  private applyFilter(): void {
    const examsFilteredByYearAndSubject = this.examHistory.exams
      .filter(wrapper => {
        const { schoolYear, subject } = this.filterState;
        return (schoolYear == null || schoolYear === wrapper.exam.schoolYear)
          && (subject == null || subject === wrapper.assessment.subject);
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
  private updateRoute(): void {
    const parameters: any = {};
    if (this.filterState.schoolYear) {
      parameters.schoolYear = this.filterState.schoolYear;
    }
    if (this.filterState.subject) {
      parameters.subject = this.filterState.subject;
    }

    this.router.navigate([
      'students',
      this.examHistory.student.id,
      parameters
    ], {
      relativeTo: this.route.parent.parent
    });
  }

  private createSections(exams: StudentHistoryExamWrapper[]): Section[] {
    return exams.reduce((sections, wrapper) => {
      const { type, subject } = wrapper.assessment;
      const section = sections.find(section => section.assessmentTypeCode === type && section.subjectCode === subject);
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
    }, []).sort(join(
      AssessmentTypeOrdering.on<Section>(section => section.assessmentTypeCode).compare,
      SubjectOrdering.on<Section>(section => section.subjectCode).compare
    ));
  }

  /**
   * Initialize the current filter state from the initial request.
   *
   * @param exams       The available exams
   * @param params      The route params
   */
  private createFilterState(exams: StudentHistoryExamWrapper[], parameters: any): StudentResultsFilterState {

    const filterState: StudentResultsFilterState = exams.reduce((filterState, wrapper: StudentHistoryExamWrapper) => {
        const { schoolYear } = wrapper.exam;
        if (filterState.schoolYears.indexOf(schoolYear) === -1) {
          filterState.schoolYears.push(schoolYear);
        }
        const { subject } = wrapper.assessment;
        if (filterState.subjects.indexOf(subject) === -1) {
          filterState.subjects.push(subject);
        }
        return filterState;
      },
      {
        schoolYears: [],
        subjects: []
      }
    );

    filterState.schoolYears.sort((a, b) => b - a);
    filterState.subjects.sort(SubjectOrdering.compare);

    const { schoolYear, subject } = parameters;
    if (schoolYear) {
      filterState.schoolYear = parseInt(schoolYear);
    }
    if (subject) {
      filterState.subject = subject;
    }

    return filterState;
  }

  /**
   * Initializes StudentReportDownloadComponent options with the currently selected filters
   *
   * @param downloader
   */
  initializeDownloader(downloader: StudentReportDownloadComponent): void {
    downloader.options.schoolYear = this.filterState.schoolYear
      ? this.filterState.schoolYear
      : this.filterState.schoolYears[0];
    downloader.options.subject = this.filterState.subject;
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
