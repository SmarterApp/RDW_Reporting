import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ordering } from '@kourge/ordering';
import { FilterBy } from './model/filter-by.model';
import { AssessmentExam } from './model/assessment-exam.model';
import { ExamFilterOptions } from './model/exam-filter-options.model';
import { Assessment } from './model/assessment.model';
import { ExamFilterOptionsService } from './filters/exam-filters/exam-filter-options.service';
import { byGradeThenByName } from './assessment.comparator';
import { AssessmentProvider } from './assessment-provider.interface';
import { GradeCode } from '../shared/enum/grade-code.enum';
import { ColorService } from '../shared/color.service';
import { AssessmentExporter } from './assessment-exporter.interface';
import { ReportingEmbargoService } from '../shared/embargo/reporting-embargo.service';
import { share } from 'rxjs/operators';
import { ApplicationSettingsService } from '../app-settings.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

/**
 * This component encompasses all the functionality for displaying and filtering
 * assessments given an assessmentExams array and an assessmentProvider.  The content
 * that has been transcluded the <assessment> tag will get dropped into the basic
 * filter section.
 */
@Component({
  selector: 'assessments',
  templateUrl: './assessments.component.html'
})
export class AssessmentsComponent implements OnInit {

  /**
   * The array of asssessment exams to show.
   * @param value
   */
  @Input()
  set assessmentExams(value: AssessmentExam[]) {
    this._assessmentExams = value;
    const { assessmentIds } = this.route.snapshot.params;
    if (!assessmentIds) {
      this.showOnlyMostRecent = true;
    }
    this._hasInitialAssessment = (this._assessmentExams != null && this._assessmentExams.length != 0);
  }

  private _preselectedAssessments: Assessment[] = [];

  /**
   * The provider which implements the AssessmentProvider interface in order
   * to load assessment and exam data.
   */
  @Input()
  assessmentProvider: AssessmentProvider;

  /**
   * The provider which implements the AssessmentExporter interface in order
   * to export data.
   */
  @Input()
  assessmentExporter: AssessmentExporter;

  @Input()
  hideAssessments: boolean = false;

  /**
   * If true, the session toggles will be display with the most recent selected
   * by default.  Otherwise, they won't be displayed and all results will be shown.
   */
  @Input()
  allowFilterBySessions = true;

  @Output()
  export: EventEmitter<any> = new EventEmitter<any>();

  showValuesAsPercent = true;
  filterDisplayOptions: any = {
    expanded: true
  };
  clientFilterBy: FilterBy;

  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  availableAssessments: Assessment[] = [];
  assessmentsLoading: any[] = [];
  minimumItemDataYear: number;
  exportDisabled = true;

  get assessmentExams(): AssessmentExam[] {
    return this._assessmentExams;
  }

  get showAdvancedFilters(): boolean {
    return this._showAdvancedFilters;
  }

  set showAdvancedFilters(value: boolean) {
    this._showAdvancedFilters = value;
    this.filterDisplayOptions.expanded = value; // Automatically expand / collapse filter options.
  }

  get hasInitialAssessment(): boolean {
    return this._hasInitialAssessment;
  }

  get expandAssessments(): boolean {
    return this._expandAssessments && this.assessmentExams.length > 0;
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
    this._showOnlyMostRecent = value;

    if (value) {
      this.availableAssessments = [];
      this.updateAssessment(this.route.snapshot.data[ 'assessment' ]);
    }
  }

  get selectedAssessments(): Assessment[] {
    if (!this.showOnlyMostRecent && this._preselectedAssessments.length > 0) {
      return this._preselectedAssessments;
    } else if (this.showOnlyMostRecent && this._assessmentExams.length > 0) {
      this._preselectedAssessments = [];
      return this._assessmentExams.map(x => x.assessment);
    } else if (this.availableAssessments.length > 0) {
      this._preselectedAssessments = [];
      return this.availableAssessments.filter(x => x.selected);
    }

    return [];
  }

  /**
   * When set, toggle the collapsed state of all assessment exams.
   *
   * @param allCollapsed True if all assessment exams should be collapsed
   */
  set allCollapsed(allCollapsed: boolean) {
    for (const assessmentExam of this._assessmentExams) {
      assessmentExam.collapsed = allCollapsed;
    }
  }

  /**
   * @returns {boolean} True only if ALL assessment exams are collapsed
   */
  get allCollapsed(): boolean {
    return this._assessmentExams.every((assessmentExam) => assessmentExam.collapsed);
  }

  get allSelected(): boolean {
    return this._isAllSelected;
  }

  private _showAdvancedFilters = false;
  private _expandAssessments = false;
  private _hasInitialAssessment = false;
  private _showOnlyMostRecent = true;
  private _assessmentExams: AssessmentExam[];
  private _isAllSelected = false;

  constructor(public colorService: ColorService,
              private route: ActivatedRoute,
              applicationSettingsService: ApplicationSettingsService,
              filterOptionService: ExamFilterOptionsService,
              embargoService: ReportingEmbargoService) {

    this.clientFilterBy = new FilterBy();

    forkJoin(
      applicationSettingsService.getSettings(),
      filterOptionService.getExamFilterOptions(),
      embargoService.isEmbargoed()
    ).subscribe(([ settings, filterOptions, embargoed ]) => {
      this.minimumItemDataYear = settings.minItemDataYear;
      this.filterOptions = filterOptions;
      this.exportDisabled = embargoed;
    });
  }

  ngOnInit() {
    const { assessmentIds } = this.route.snapshot.params;
    if (!assessmentIds) {
      this.showOnlyMostRecent = true;
    } else {
      this.assessmentProvider.getAvailableAssessments().subscribe((availableAssessment) => {
        const preselectedAssessments = availableAssessment.filter((assessment) => assessmentIds.split(',').indexOf(assessment.id.toString()) >= 0);
        preselectedAssessments.forEach((assessment) => {
          assessment.selected = true;
          this.loadAssessmentExam(assessment);
          this._preselectedAssessments = this._preselectedAssessments.concat(assessment);
        });
        this._hasInitialAssessment = true;
        this.updateFilterOptions();
        this.showOnlyMostRecent = false;
        this.expandAssessments = false;
      });
    }
  }

  getGradeIdx(gradeCode: string): number {
    return GradeCode.getIndex(gradeCode);
  }

  removeEthnicity(ethnicity) {
    this.clientFilterBy.ethnicities[ ethnicity ] = false;
    if (this.clientFilterBy.filteredEthnicities.length == 0) {
      this.clientFilterBy.ethnicities[ 0 ] = true; // None are selected, set all to true.
    }

    this.clientFilterBy.ethnicities = Object.assign({}, this.clientFilterBy.ethnicities);
  }

  removeGender(gender) {
    this.clientFilterBy.genders[ gender ] = false;
    if (this.clientFilterBy.filteredGenders.length == 0) {
      this.clientFilterBy.genders[ 0 ] = true; // None are selected, set all to true.
    }

    this.clientFilterBy.genders = Object.assign({}, this.clientFilterBy.genders);
  }

  removeElasCode(elasCode) {
    this.clientFilterBy.elasCodes[ elasCode ] = false;
    if (this.clientFilterBy.filteredElasCodes.length == 0) {
      this.clientFilterBy.elasCodes[ 0 ] = true; // None are selected, set all to true.
    }

    this.clientFilterBy.elasCodes = Object.assign({}, this.clientFilterBy.elasCodes);
  }

  removeFilter(property) {
    if (property === 'offGradeAssessment') {
      this.clientFilterBy[ property ] = false;
    } else if (property === 'transferAssessment') {
      this.clientFilterBy[ property ] = false;
    } else if (property.indexOf('ethnicities') > -1) {
      this.removeEthnicity(property.substring(property.indexOf('.') + 1));
    } else if (property.indexOf('genders') > -1) {
      this.removeGender(property.substring(property.indexOf('.') + 1));
    } else if (property.indexOf('elasCodes') > -1) {
      this.removeElasCode(property.substring(property.indexOf('.') + 1));
    } else {
      this.clientFilterBy[ property ] = -1;
    }
  }

  updateAssessment(latestAssessment: AssessmentExam) {
    this._assessmentExams = [];
    if (latestAssessment) {
      this._assessmentExams = [ latestAssessment ];
    }

    this.updateFilterOptions();
  }

  removeAssessment(assessment: Assessment) {
    if (this.selectedAssessments.length > 1) {
      assessment.selected = false;
      this.selectedAssessmentsChanged(assessment);
    }
  }

  selectedAssessmentsChanged(assessment: Assessment) {
    if (assessment.selected) {
      this.loadAssessmentExam(assessment);
    } else {
      this.removeUnselectedAssessmentExams();
    }

    this.updateFilterOptions();

    // have all the assessments been selected
    this._isAllSelected = (this.selectedAssessments.length == this.availableAssessments.length);
  }

  openAndScrollToAdvancedFilters() {
    this.showAdvancedFilters = true;
    setTimeout(() => {
      document.getElementById('results-adv-filters').scrollIntoView();
    }, 0);
  }

  callExport() {
    this.export.emit();
  }

  private updateFilterOptions() {
    this.filterOptions.hasInterim = this.selectedAssessments.some(a => a.isInterim);
    this.filterOptions.hasSummative = this.selectedAssessments.some(a => a.isSummative);
  }

  private loadAssessmentExam(assessment: Assessment) {
    const subscription = this.assessmentProvider.getExams(assessment.id)
      .subscribe(exams => {
        const assessmentLoaded = this.assessmentsLoading.splice(this.assessmentsLoading.findIndex(al => al.assessment.id == assessment.id), 1);
        const assessmentExam = new AssessmentExam();
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

    const assessmentsLoading = this.assessmentsLoading.filter(loading => !this.selectedAssessments.some(selected => loading.assessment.id == selected.id));

    // cancel api calls in flight.
    for (const loading of assessmentsLoading) {
      loading.subscription.unsubscribe();
    }

    this.assessmentsLoading = this.assessmentsLoading.filter(loading => this.selectedAssessments.some(selected => loading.assessment.id == selected.id));
  }

  private getAvailableAssessments() {
    if (this._expandAssessments) {
      const observable = this.assessmentProvider.getAvailableAssessments().pipe(share());

      observable.subscribe(result => {
        // TODO fix this so that we don't need an Array.map callback with side-effects
        this.availableAssessments = result.map(available => {
          available.selected = this._assessmentExams.some(assessmentExam => assessmentExam.assessment.id == available.id);
          return available;
        });
      });

      return observable;
    }
  }
}
