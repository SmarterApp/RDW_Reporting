import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AssessmentExam } from "./model/assessment-exam.model";
import { FilterBy } from "./model/filter-by.model";
import { ExamFilterService } from "./exam-filters/exam-filter.service";
import { ExamFilterOptionsService } from "./exam-filters/exam-filter-options.service";
import { ExamFilterOptions } from "./model/exam-filter-options.model";
import { Assessment } from "./model/assessment.model";
import { AssessmentService } from "./assessment/assessment.service";
import { GradeService } from "../../shared/grade.service";

@Component({
  selector: 'app-group-results',
  templateUrl: './group-results.component.html',
})
export class GroupResultsComponent implements OnInit {
  groups;
  showValuesAsPercent: boolean = true;
  expandFilterOptions: boolean = false;
  clientFilterBy: FilterBy;
  assessmentExams: AssessmentExam[] = [];
  filters: any[] = [];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  currentFilters = [];
  availableAssessments: Assessment[] = [];
  assessmentsLoading : any[] = [];

  get currentGroup() {
    return this._currentGroup;
  }

  set currentGroup(value) {
    this._currentGroup = value;
    this.getAvailableAssessments();
  }

  get currentSchoolYear() {
    return this._currentSchoolYear;
  }

  set currentSchoolYear(value) {
    this._currentSchoolYear = value;
    this.getAvailableAssessments();
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

    if(value)
      this._showOnlyMostRecent = false;
  }

  get showOnlyMostRecent(): boolean {
    return this._showOnlyMostRecent;
  }

  set showOnlyMostRecent(value: boolean) {
    this.expandAssessments = !value;
    if(value) {
      this.availableAssessments = [];
      this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
    }

    this._showOnlyMostRecent = value;
  }

  get selectedAssessments() {
    if(this.showOnlyMostRecent && this.assessmentExams)
      return this.assessmentExams.map(x => x.assessment);
    else if(this.availableAssessments)
      return this.availableAssessments.filter(x => x.selected);

    return [];
  }

  /**
   * When set, toggle the collapsed state of all assessment exams.
   *
   * @param allCollapsed True if all assessment exams should be collapsed
   */
  set allCollapsed(allCollapsed: boolean) {
    for (let assessmentExam of this.assessmentExams) {
      assessmentExam.collapsed = allCollapsed;
    }
  }

  /**
   * @returns {boolean} True only if ALL assessment exams are collapsed
   */
  get allCollapsed(): boolean {
    return !this.assessmentExams.some((assessmentExam) => !assessmentExam.collapsed);
  }

  private _showAdvancedFilters: boolean = false;
  private _expandAssessments: boolean = false;
  private _showOnlyMostRecent: boolean = true;
  private _currentGroup;
  private _currentSchoolYear;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private filterOptionService: ExamFilterOptionsService,
              private examFilterService: ExamFilterService,
              private assessmentService: AssessmentService,
              private gradeService: GradeService) {
    this.clientFilterBy = new FilterBy()
  }

  ngOnInit() {
    this.groups = this.route.snapshot.data[ "groups" ];
    this._currentGroup = this.groups.find(x => x.id == this.route.snapshot.params[ "groupId" ]);
    this.examFilterService.getFilterDefinitions().forEach(filter => {
      this.filters[ filter.name ] = filter;
    });

    this.updateAssessment(this.route.snapshot.data[ "assessment" ]);

    this.filterOptionService.getExamFilterOptions().subscribe(filterOptions => {
      this.filterOptions = filterOptions;
      this._currentSchoolYear = this.mapParamsToSchoolYear(this.route.snapshot.params);
    });
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
    this.assessmentExams = [];
    if (latestAssessment) {
      this.assessmentExams.push(latestAssessment);
    }
  }

  updateRoute() {
    this.router.navigate(
      [ 'groups', this._currentGroup.id,
        { schoolYear: this._currentSchoolYear, } ]).then(() => {
      this.showOnlyMostRecent = true;
    });
  }

  mapParamsToSchoolYear(params) {
    return Number.parseInt(params[ "schoolYear" ]) || this.filterOptions.schoolYears[ 0 ];
  }

  removeAssessment(assessment: Assessment){
    assessment.selected = false;
    this.selectedAssessmentsChanged(assessment);
  }

  selectedAssessmentsChanged(assessment: Assessment) {
    if(assessment.selected){
      this.loadAssessmentExam(assessment);
    }
    else {
      this.removeUnselectedAssessmentExams();
    }
  }

  private loadAssessmentExam(assessment: Assessment){
    let subscription = this.assessmentService.getExams(this._currentGroup.id, this._currentSchoolYear, assessment.id)
      .subscribe(exams => {
        let assessmentLoaded = this.assessmentsLoading.splice(this.assessmentsLoading.findIndex(al => al.assessment.id == assessment.id), 1);
        let assessmentExam = new AssessmentExam();
        assessmentExam.assessment = assessmentLoaded[0].assessment;
        assessmentExam.exams = exams;

        this.assessmentExams.push(assessmentExam);
        this.assessmentExams.sort((x, y) => {
          if(x.assessment.grade == y.assessment.grade){
            return x.assessment.name > y.assessment.name ? 1: -1;
          }
          return x.assessment.grade > y.assessment.grade ? 1: -1;
        });
      });

    // Keeping track of this array allows us to unsubscribe from api calls in flight
    // should the user decide to remove an assessment before it's finished loading.
    this.assessmentsLoading.push({ assessment: assessment, subscription: subscription });
  }

  private removeUnselectedAssessmentExams() {
    this.assessmentExams = this.assessmentExams.filter(loaded => this.selectedAssessments.some(selected => loaded.assessment.id == selected.id));

    let assessmentsLoading = this.assessmentsLoading.filter(loading => !this.selectedAssessments.some(selected => loading.assessment.id == selected.id ));

    // cancel api calls in flight.
    for(let loading of assessmentsLoading){
      loading.subscription.unsubscribe();
    }

    this.assessmentsLoading = this.assessmentsLoading.filter(loading => this.selectedAssessments.some(selected => loading.assessment.id == selected.id ));;
  }

  private getAvailableAssessments() {
    if (this._expandAssessments) {
      let observable = this.assessmentService.getAvailableAssessments(this._currentGroup.id, this._currentSchoolYear).share();

      observable.subscribe(result => {
        this.availableAssessments = result.map(available => {
          available.selected = this.assessmentExams.some(assessmentExam => assessmentExam.assessment.id == available.id);
          return available;
        });
      });

      return observable;
    }
  }
}
