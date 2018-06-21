import { Component, OnInit } from '@angular/core';
import { MeasuredAssessment } from '../measured-assessment';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../../groups/group';
import { GroupService } from '../../groups/group.service';
import { GroupDashboardService } from './group-dashboard.service';
import { ExamFilterOptionsService } from '../../assessments/filters/exam-filters/exam-filter-options.service';
import { ExamFilterOptions } from '../../assessments/model/exam-filter-options.model';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AssessmentCardEvent } from './group-assessment-card.component';
import { GroupReportDownloadComponent } from '../../report/group-report-download.component';
import { byString } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { UserGroupService } from '../../user-group/user-group.service';
import * as _ from 'lodash';
import { map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'group-dashboard',
  templateUrl: './group-dashboard.component.html'
})
export class GroupDashboardComponent implements OnInit {

  measuredAssessments: MeasuredAssessment[] = [];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  groups: Group[];
  group: Group;
  schoolYear: number;
  subjects: string[];
  subject: string;
  loadingMeasuredAssessments: boolean = true;
  itemsPerRow: number = 3;
  rows: MeasuredAssessment[][] = [];

  private selectedAssessments: MeasuredAssessment[] = [];
  private _previousRouteParameters: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private groupService: GroupService,
              private userGroupService: UserGroupService,
              private groupDashboardService: GroupDashboardService,
              private filterOptionsService: ExamFilterOptionsService) {
  }

  ngOnInit() {
    forkJoin(
      this.filterOptionsService.getExamFilterOptions(),
      this.groupService.getGroups(),
      this.userGroupService.safelyGetUserGroupsAsGroups()
    ).subscribe(([ filterOptions, groups, userGroups ]) => {
      this.filterOptions = filterOptions;
      this.groups = groups
        .concat(userGroups)
        .sort(ordering(byString).on<Group>(({ name }) => name).compare);

      this.subscribeToRouteChanges();
      this.updateRouteWithDefaultFilters();
    });
  }

  private subscribeToRouteChanges(): void {
    this.route.params.pipe(
      mergeMap(parameters => {
        const { groupId, userGroupId, schoolYear } = parameters;
        const previousParameters = this._previousRouteParameters;

        const reload = previousParameters == null
          || previousParameters.schoolYear != schoolYear
          || (previousParameters.groupId != null && previousParameters.groupId != groupId)
          || (previousParameters.userGroupId != null && previousParameters.userGroupId != userGroupId);

        this._previousRouteParameters = parameters;

        // exit early if we don't need to re fetch the assessment data
        if (!reload) {
          return of({ ...parameters, reload });
        }

        return forkJoin(
          groupId != null
            ? this.groupService.getGroup(groupId)
            : this.userGroupService.getUserGroupAsGroup(userGroupId),
          this.groupDashboardService.getAvailableMeasuredAssessments(<any>parameters)
        ).pipe(
          map(([ group, measuredAssessments ]) => <any>{ ...parameters, group, measuredAssessments, reload })
        );
      })
    ).subscribe(resolvedParameters => {
      const { reload, group, schoolYear, subject, measuredAssessments } = resolvedParameters;
      if (reload) {
        this.group = group;
        this.schoolYear = Number.parseInt(schoolYear) || undefined;
        this.updateMeasuredAssessments(measuredAssessments);
      }
      if (group == null || group.subjectCode == null || group.subjectCode === subject) {
        this.subject = subject;
      } else {
        delete this.subject;
        this.updateRoute(true);
      }
      this.updateRows();
      this.loadingMeasuredAssessments = false;
    });
  }

  private updateRouteWithDefaultFilters(): void {
    const { schoolYear } = this.route.snapshot.params;
    if (schoolYear == null) {
      this.schoolYear = this.filterOptions.schoolYears[ 0 ];
      this.updateRoute(true);
    }
  }

  onGroupChange(): void {
    this.updateRoute();
  }

  onSchoolYearChange(): void {
    this.updateRoute();
  }

  onSubjectChange(): void {
    this.updateRoute();
  }

  groupEquals(a: Group, b: Group): boolean {
    return a === b || (
      a != null
      && b != null
      && a.id === b.id
    );
  }

  updateRows(): void {
    const filteredAssessments = this.measuredAssessments
      .filter(measuredAssessment => this.subject == null || measuredAssessment.assessment.subject === this.subject);
    this.rows = _.chunk(filteredAssessments, this.itemsPerRow);
  }

  get viewAssessmentsButtonEnabled(): boolean {
    return this.selectedAssessments.length !== 0;
  }

  get stateAsNavigationParameters(): any {
    const { group, schoolYear, subject } = this;
    const parameters: any = Object.assign({}, this.route.snapshot.params, {
      schoolYear
    });
    if (subject) {
      parameters.subject = subject;
    } else {
      delete parameters.subject;
    }
    if (group) {
      if (group.userCreated) {
        parameters.userGroupId = group.id;
        delete parameters.groupId;
      } else {
        parameters.groupId = group.id;
        delete parameters.userGroupId;
      }
    }
    return parameters;
  }

  updateRoute(replaceUrl: boolean = false): void {
    this.loadingMeasuredAssessments = true;
    this.selectedAssessments = [];
    this.router.navigate([ this.stateAsNavigationParameters ], { replaceUrl });
  }

  updateMeasuredAssessments(assessments: MeasuredAssessment[]): void {
    this.measuredAssessments = assessments
      .sort(ordering(byString).on<MeasuredAssessment>(x => x.assessment.label).compare);

    const assessmentSubjects = new Set(assessments.map(x => x.assessment.subject));
    this.subjects = this.filterOptions.subjects
      .filter(subject => assessmentSubjects.has(subject));

  }

  viewAssessments(): void {
    const parameters: any = {
      ...this.stateAsNavigationParameters,
      assessmentIds: this.selectedAssessments
        .map(measuredAssessment => measuredAssessment.assessment.id)
    };
    this.router.navigate([ 'group-exams', parameters ]);
  }

  onCardSelection(event: AssessmentCardEvent) {
    this.selectedAssessments = event.selected
      ? this.selectedAssessments.concat(event.measuredAssessment)
      : this.selectedAssessments
        .filter(measuredAssessment => measuredAssessment.assessment.id !== event.measuredAssessment.assessment.id);
  }

  /**
   * Initializes GroupReportDownloadComponent options with the currently selected filters
   *
   * @param downloader
   */
  initializeDownloader(downloader: GroupReportDownloadComponent): void {
    downloader.options.schoolYear = this.schoolYear;
  }

}
