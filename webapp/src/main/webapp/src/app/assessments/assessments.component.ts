import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { ordering } from "@kourge/ordering";
import { FilterBy } from "./model/filter-by.model";
import { AssessmentExam } from "./model/assessment-exam.model";
import { ExamFilterOptions } from "./model/exam-filter-options.model";
import { Assessment } from "./model/assessment.model";
import { ExamFilterService } from "./filters/exam-filters/exam-filter.service";
import { ExamFilterOptionsService } from "./filters/exam-filters/exam-filter-options.service";
import { GradeService } from "../shared/grade.service";
import { AssessmentItem } from "./model/assessment-item.model";
import { byGradeThenByName } from "./assessment.comparator";
import { AssessmentProvider } from "./assessment-provider.interface";

/**
 * This component encompasses all the functionality for displaying and filtering
 * assessments given an assessmentExams array and an assessmentProvider.  The content
 * that has been transcluded the <assessment> tag will get dropped into the basic
 * filter section.
 */
@Component({
  selector: 'assessments',
  templateUrl: './assessments.component.html',
})
export class AssessmentsComponent implements OnInit {
  /**
   * The array of asssessment exams to show.
   * @param value
   */
  @Input()
  set assessmentExams(value: AssessmentExam[]) {
    this._assessmentExams = value;
    this.showOnlyMostRecent = true;
  }

  /**
   * The provider which implements the AssessmentProvider interface in order
   * to load assessment and exam data.
   */
  @Input()
  assessmentProvider: AssessmentProvider;

  showValuesAsPercent: boolean = true;
  expandFilterOptions: boolean = false;
  clientFilterBy: FilterBy;

  filters: any[] = [];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  currentFilters = [];
  availableAssessments: Assessment[] = [];
  assessmentsLoading: any[] = [];
  boundLoadAssessmentItems: Function;

  get assessmentExams(): AssessmentExam[] {
    return this._assessmentExams;
  }

  get showAdvancedFilters(): boolean {
    return this._showAdvancedFilters;
  }

  set showAdvancedFilters(value: boolean) {
    this._showAdvancedFilters = value;
    this.expandFilterOptions = value; // Automatically expand / collapse filter options.
  }

  get expandAssessments(): boolean {
    return this._expandAssessments;
  }

  set expandAssessments(value: boolean) {
    this._expandAssessments = value;
    this.getAvailableAssessments();

    if (value)
      this._showOnlyMostRecent = false;
  }

  get showOnlyMostRecent(): boolean {
    return this._showOnlyMostRecent;
  }

  set showOnlyMostRecent(value: boolean) {
    this.expandAssessments = !value;
    if (value) {
      this.availableAssessments = [];
      this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
    }

    this._showOnlyMostRecent = value;
  }

  get selectedAssessments() {
    if (this.showOnlyMostRecent && this._assessmentExams)
      return this._assessmentExams.map(x => x.assessment);
    else if (this.availableAssessments)
      return this.availableAssessments.filter(x => x.selected);

    return [];
  }

  /**
   * When set, toggle the collapsed state of all assessment exams.
   *
   * @param allCollapsed True if all assessment exams should be collapsed
   */
  set allCollapsed(allCollapsed: boolean) {
    for (let assessmentExam of this._assessmentExams) {
      assessmentExam.collapsed = allCollapsed;
    }
  }

  /**
   * @returns {boolean} True only if ALL assessment exams are collapsed
   */
  get allCollapsed(): boolean {
    return this._assessmentExams.every((assessmentExam) => assessmentExam.collapsed);
  }

  private _showAdvancedFilters: boolean = false;
  private _expandAssessments: boolean = false;
  private _showOnlyMostRecent: boolean = true;
  private _assessmentExams: AssessmentExam[];

  constructor(private route: ActivatedRoute,
              private filterOptionService: ExamFilterOptionsService,
              private examFilterService: ExamFilterService,
              private gradeService: GradeService) {
    this.clientFilterBy = new FilterBy()
  }

  ngOnInit() {
    this.examFilterService.getFilterDefinitions().forEach(filter => {
      this.filters[ filter.name ] = filter;
    });

    this.filterOptionService.getExamFilterOptions().subscribe(filterOptions => {
      this.filterOptions = filterOptions;
    });

    this.boundLoadAssessmentItems = this.loadAssessmentItems.bind(this);
  }

  removeEthnicity(ethnicity) {
    this.clientFilterBy.ethnicities[ ethnicity ] = false;
    if (this.clientFilterBy.filteredEthnicities.length == 0) {
      this.clientFilterBy.ethnicities[ 0 ] = true; // None are selected, set all to true.
    }

    this.clientFilterBy.ethnicities = Object.assign({}, this.clientFilterBy.ethnicities);
  }

  removeFilter(property) {
    if (property == 'offGradeAssessment') {
      this.clientFilterBy[ property ] = false;
    }
    else if (property.indexOf('ethnicities') > -1) {
      this.removeEthnicity(property.substring(property.indexOf('.') + 1));
    }
    else {
      this.clientFilterBy[ property ] = -1;
    }
  }

  updateAssessment(latestAssessment) {
    this._assessmentExams = [];
    if (latestAssessment) {
      this._assessmentExams.push(latestAssessment);
    }
  }

  removeAssessment(assessment: Assessment) {
    assessment.selected = false;
    this.selectedAssessmentsChanged(assessment);
  }

  selectedAssessmentsChanged(assessment: Assessment) {
    if (assessment.selected) {
      this.loadAssessmentExam(assessment);
    }
    else {
      this.removeUnselectedAssessmentExams();
    }
  }

  private loadAssessmentItems(assessmentId: number): Observable<AssessmentItem[]> {
    return this.assessmentProvider.getAssessmentItems(assessmentId);
  }

  private loadAssessmentExam(assessment: Assessment) {
    let subscription = this.assessmentProvider.getExams(assessment.id)
      .subscribe(exams => {
        let assessmentLoaded = this.assessmentsLoading.splice(this.assessmentsLoading.findIndex(al => al.assessment.id == assessment.id), 1);
        let assessmentExam = new AssessmentExam();
        assessmentExam.assessment = assessmentLoaded[ 0 ].assessment;
        assessmentExam.exams = exams;

        this._assessmentExams.push(assessmentExam);
        this._assessmentExams.sort(ordering(byGradeThenByName).on<AssessmentExam>(assessmentExam => assessmentExam.assessment).compare);
      });

    // Keeping track of this array allows us to unsubscribe from api calls in flight
    // should the user decide to remove an assessment before it's finished loading.
    this.assessmentsLoading.push({ assessment: assessment, subscription: subscription });
  }

  private removeUnselectedAssessmentExams() {
    this._assessmentExams = this._assessmentExams.filter(loaded => this.selectedAssessments.some(selected => loaded.assessment.id == selected.id));

    let assessmentsLoading = this.assessmentsLoading.filter(loading => !this.selectedAssessments.some(selected => loading.assessment.id == selected.id));

    // cancel api calls in flight.
    for (let loading of assessmentsLoading) {
      loading.subscription.unsubscribe();
    }

    this.assessmentsLoading = this.assessmentsLoading.filter(loading => this.selectedAssessments.some(selected => loading.assessment.id == selected.id));
  }

  private getAvailableAssessments() {
    if (this._expandAssessments) {
      let observable = this.assessmentProvider.getAvailableAssessments().share();

      observable.subscribe(result => {
        this.availableAssessments = result.map(available => {
          available.selected = this._assessmentExams.some(assessmentExam => assessmentExam.assessment.id == available.id);
          return available;
        });
      });

      return observable;
    }
  }
}
