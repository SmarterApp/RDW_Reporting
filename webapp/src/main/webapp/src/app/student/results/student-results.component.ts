import { OnInit, Component } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { StudentExamHistory } from "../model/student-exam-history.model";
import { Location } from "@angular/common";
import { URLSearchParams } from "@angular/http";
import { StudentResultsFilterState } from "./model/student-results-filter-state.model";
import { StudentHistoryExamWrapper } from "../model/student-history-exam-wrapper.model";
import { AssessmentType } from "../../shared/enum/assessment-type.enum";

@Component({
  selector: 'student-results',
  templateUrl: './student-results.component.html'
})
export class StudentResultsComponent implements OnInit {

  examHistory: StudentExamHistory;
  filterState: StudentResultsFilterState = new StudentResultsFilterState();
  examsByTypeAndSubject: Map<AssessmentType, Map<string, StudentHistoryExamWrapper[]>> = new Map();
  displayState: any = {};

  get assessmentTypes(): AssessmentType[] {
    return Array.from(this.examsByTypeAndSubject.keys())
      .sort((a, b) => a - b);
  }

  constructor(private route: ActivatedRoute,
              private location: Location) {
  }

  ngOnInit(): void {
    this.examHistory = this.route.snapshot.data[ "examHistory" ];
    this.initializeFilter(
      this.examHistory.exams,
      this.route.snapshot.queryParams);
    this.applyFilter();
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
    this.updateRoute();
    this.applyFilter();
  }

  isCollapsed(assessmentType: AssessmentType, subject: string): boolean {
    return this.displayState[assessmentType]
      && this.displayState[assessmentType][subject]
      && this.displayState[assessmentType][subject].collapsed;
  }

  toggleCollapsed(assessmentType: AssessmentType, subject: string): void {
    this.displayState[assessmentType] = this.displayState[assessmentType] || {};
    this.displayState[assessmentType][subject] = this.displayState[assessmentType][subject] || {};
    this.displayState[assessmentType][subject].collapsed = !this.displayState[assessmentType][subject].collapsed;
  }

  /**
   * Apply the current filter state to the exams.
   */
  private applyFilter(): void {
    let filteredExams: StudentHistoryExamWrapper[] = this.examHistory.exams
      .filter((wrapper) => this.filterExam(wrapper));

    let examsByTypeAndSubject: Map<AssessmentType, Map<string, StudentHistoryExamWrapper[]>> = new Map();
    filteredExams.forEach((wrapper) => {
      let type: AssessmentType = wrapper.assessment.type;
      let subject: string = wrapper.assessment.subject;
      let byType: Map<string, StudentHistoryExamWrapper[]> = examsByTypeAndSubject.get(type) || new Map();
      let bySubject: StudentHistoryExamWrapper[] = byType.get(subject) || [];
      bySubject.push(wrapper);
      byType.set(subject, bySubject);
      examsByTypeAndSubject.set(type, byType);
    });

    this.examsByTypeAndSubject = examsByTypeAndSubject;
  }

  /**
   * Filter an exam by the current filter state.
   *
   * @param wrapper The exam wrapper to filter
   * @returns {boolean} True if the exam should be visible
   */
  private filterExam(wrapper: StudentHistoryExamWrapper): boolean {
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
    // Interim Administration Type filter
    if (this.filterState.filterBy.administration != -1) {
      if (wrapper.assessment.type !== AssessmentType.SUMMATIVE
        && wrapper.exam.administrativeCondition !== this.filterState.filterBy.administration) {
        return false;
      }
    }
    // Summitive Validation State filter
    if (this.filterState.filterBy.summativeStatus != -1) {
      if (wrapper.assessment.type === AssessmentType.SUMMATIVE
        && wrapper.exam.administrativeCondition !== this.filterState.filterBy.summativeStatus) {
        return false;
      }
    }
    // Completion state
    if (this.filterState.filterBy.completion != -1) {
      if (wrapper.exam.completeness !== this.filterState.filterBy.completion) {
        return false;
      }
    }
    // Off-Grade Assessment filter
    if (this.filterState.filterBy.offGradeAssessment) {
      if (wrapper.exam.enrolledGrade !== wrapper.assessment.grade) {
        return false;
      }
    }

    return true;
  }

  /**
   * Update the current route based upon the current filter state.
   * Do not re-load the page or re-fetch data.
   */
  private updateRoute(): void {
    let searchParams: URLSearchParams = new URLSearchParams();
    if (this.filterState.schoolYear > 0) {
      searchParams.set("schoolYear", this.filterState.schoolYear.toString());
    }
    if (this.filterState.subject) {
      searchParams.set("subject", this.filterState.subject);
    }

    //Update the current route without navigating
    this.location.replaceState(
      `/students/${this.examHistory.student.ssid}`,
      searchParams.toString()
    );
  }

  /**
   * Initialize the current filter state from the initial request.
   *
   * @param exams       The available exams
   * @param params      The route query params
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
}
