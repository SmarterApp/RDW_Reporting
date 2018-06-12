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
import { Search } from '../../groups/results/group-assessment.service';
import * as _ from 'lodash';

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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private groupService: GroupService,
              private userGroupService: UserGroupService,
              private groupDashboardService: GroupDashboardService,
              private filterOptionsService: ExamFilterOptionsService) {
  }

  ngOnInit() {
    const { groupId, userGroupId, schoolYear } = this.route.snapshot.params;
    forkJoin(
      groupId != null
        ? this.groupService.getGroup(groupId)
        : this.userGroupService.getUserGroupAsGroup(userGroupId),
      this.groupService.getGroups(),
      this.userGroupService.safelyGetUserGroupsAsGroups(),
      this.filterOptionsService.getExamFilterOptions()
    ).subscribe(([ group, groups, userGroups, filterOptions ]) => {
      this.group = group;
      this.groups = groups.concat(userGroups)
        .sort(ordering(byString).on<Group>(({ name }) => name).compare);
      this.filterOptions = filterOptions;
      this.schoolYear = Number.parseInt(schoolYear) || filterOptions.schoolYears[ 0 ];
      this.groupDashboardService.getAvailableMeasuredAssessments(this.createSearch(this.group))
        .subscribe(measuredAssessments => {
          this.updateMeasuredAssessments(measuredAssessments);
        });
    });
  }

  onGroupChange(): void {
    this.updateRoute('Group');
  }

  onSchoolYearChange(): void {
    this.updateRoute('SchoolYear');
  }

  onSubjectChange(): void {
    this.updateRows();
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

  get cardViewEnabled() {
    return this.selectedAssessments.length !== 0;
  }

  get stateAsNavigationParameters(): any {
    const parameters = <any>{
      schoolYear: this.schoolYear,
      assessmentIds: this.selectedAssessments
        .map(measuredAssessment => measuredAssessment.assessment.id)
    };
    if (this.group.userCreated) {
      parameters.userGroupId = this.group.id;
    } else {
      parameters.groupId = this.group.id;
    }
    return parameters;
  }

  updateRoute(changeSource: string): void {
    this.selectedAssessments = [];
    this.router.navigate([ this.stateAsNavigationParameters ])
      .then(() => {
        this.loadingMeasuredAssessments = true;
        const getGroup = this.group.userCreated
          ? this.userGroupService.getUserGroupAsGroup(this.group.id)
          : this.groupService.getGroup(this.group.id);
        getGroup.subscribe(group => {
          this.group = group;
          this.groupDashboardService.getAvailableMeasuredAssessments(this.createSearch(this.group))
            .subscribe(measuredAssessments => {
              this.updateMeasuredAssessments(measuredAssessments);
            });
        });
      });
  }

  updateMeasuredAssessments(assessments: MeasuredAssessment[]): void {
    this.measuredAssessments = assessments
      .sort(ordering(byString).on<MeasuredAssessment>(x => x.assessment.label).compare);

    const assessmentSubjects = new Set(assessments.map(x => x.assessment.subject));
    this.subjects = this.filterOptions.subjects
      .filter(subject => assessmentSubjects.has(subject));

    this.updateRows();

    this.loadingMeasuredAssessments = false;
  }

  viewAssessments(): void {
    this.router.navigate([ 'group-exams', this.stateAsNavigationParameters ]).then(() => {
      // reset selected assessments to avoid issues with going back to previous page
      this.selectedAssessments = [];
    });
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

  private createSearch(group?: Group): Search {
    return this.addGroup({ schoolYear: this.schoolYear }, group ? group : this.group);
  }

  // TODO should be in provider
  private addGroup<T extends Search>(search: T, group: Group): T {
    if (group.userCreated) {
      search.userGroupId = group.id;
    } else {
      search.groupId = group.id;
    }
    return search;
  }

}
