import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamFilterOptionsService } from '../../assessments/filters/exam-filters/exam-filter-options.service';
import { GroupAssessmentService, Search } from './group-assessment.service';
import { Angulartics2 } from 'angulartics2';
import { CsvExportService } from '../../csv-export/csv-export.service';
import { Group } from '../group';
import { GroupAssessmentExportService } from './group-assessment-export.service';
import { GroupService } from '../group.service';
import { GroupAssessmentProvider, StateProvider } from './group-assessment.provider';
import { DefaultAssessmentExporter } from './default-assessment-exporter';
import { TranslateService } from '@ngx-translate/core';
import { UserGroupService } from '../../user-group/user-group.service';
import { AssessmentsComponent } from '../../assessments/assessments.component';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AssessmentExam } from '../../assessments/model/assessment-exam.model';
import { AssessmentExporter } from '../../assessments/assessment-exporter.interface';
import { ExamFilterOptions } from '../../assessments/model/exam-filter-options.model';
import { AssessmentProvider } from '../../assessments/assessment-provider.interface';
import { GroupReportDownloadComponent } from '../../report/group-report-download.component';
import { byString } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';

@Component({
  selector: 'group-results',
  templateUrl: './group-results.component.html'
})
export class GroupResultsComponent implements OnInit, StateProvider {


  @ViewChild(AssessmentsComponent)
  assessmentsComponent: AssessmentsComponent;

  groups: any[];
  assessmentExams: AssessmentExam[] = [];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  assessmentProvider: AssessmentProvider;
  assessmentExporter: AssessmentExporter;

  private _group: any;
  private _schoolYear: number;
  latestAssessmentExam: AssessmentExam;

  get group(): Group {
    return this._group;
  }

  set group(value: Group) {
    this._group = value;
  }

  get schoolYear(): number {
    return this._schoolYear;
  }

  set schoolYear(value: number) {
    this._schoolYear = value;
  }

  get stateAsNavigationParameters(): any {
    const { group, schoolYear } = this;
    // TODO forward assessment Ids here once assessments.component can support it
    const parameters: any = { schoolYear };
    if (group) {
      if (group.userCreated) {
        parameters.userGroupId = group.id;
      } else {
        parameters.groupId = group.id;
      }
    }
    return parameters;
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private filterOptionService: ExamFilterOptionsService,
              private angulartics2: Angulartics2,
              private csvExportService: CsvExportService,
              private groupService: GroupService,
              private userGroupService: UserGroupService,
              private assessmentService: GroupAssessmentService,
              assessmentExportService: GroupAssessmentExportService,
              translateService: TranslateService) {

    this.assessmentProvider = new GroupAssessmentProvider(assessmentService, this);
    this.assessmentExporter = new DefaultAssessmentExporter(assessmentExportService, request =>
      `${this.group.name}-${request.assessment.label}-${translateService.instant(request.type.toString())}-${new Date().toDateString()}`
    );
  }

  ngOnInit(): void {
    forkJoin(
      this.groupService.getGroups(),
      this.userGroupService.safelyGetUserGroupsAsGroups(),
      this.filterOptionService.getExamFilterOptions()
    ).subscribe(([ groups, userGroups, filterOptions ]) => {
      this.groups = groups.concat(userGroups)
        .sort(ordering(byString).on<Group>(({ name }) => name).compare);
      this.filterOptions = filterOptions;

      this.subscribeToRouteChanges();
      this.updateRouteWithDefaultFilters();
    });
  }

  private subscribeToRouteChanges(): void {
    // update state when route changes
    this.route.params.subscribe(parameters => {
      const { groupId, userGroupId, schoolYear } = parameters;
      this.schoolYear = schoolYear != null ? Number.parseInt(schoolYear) : undefined;
      this.group = this.groups.find(group => group.userCreated
        ? group.id == userGroupId
        : group.id == groupId
      );
    });

    // update latest assessment when resolved route data changes
    // this and the resolve could be replaced later by a manual invocation when the route params change
    this.route.data.subscribe(({ assessment }) => {
      this.latestAssessmentExam = assessment;
      if (!this.latestAssessmentExam) {
        this.assessmentService.getMostRecentAssessment(<Search> {
          groupId: this.group.id,
          schoolYear: this.schoolYear
        }).subscribe(
          assessmentExam => {
            this.latestAssessmentExam = assessmentExam;
          });
      } else {
        this.updateAssessment(assessment);
      }
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
    this.trackAnalyticsEvent('Group', this.group.id);
    this.updateRoute();
  }

  onSchoolYearChange(): void {
    this.trackAnalyticsEvent('Year', this.schoolYear);
    this.updateRoute();
  }

  viewDashboard() {
    this.router.navigate([ 'group-dashboard', this.stateAsNavigationParameters ]);
  }

  updateAssessment(latestAssessment: AssessmentExam): void {
    this.assessmentExams = [];
    if (latestAssessment) {
      this.assessmentExams = [ latestAssessment ];
    }
  }

  exportCsv(): void {
    this.angulartics2.eventTrack.next({
      action: 'Export Group Results',
      properties: {
        category: 'Export'
      }
    });
    this.csvExportService.exportAssessmentExams(
      this.assessmentsComponent.assessmentExams,
      this.assessmentsComponent.clientFilterBy,
      this.filterOptions.ethnicities,
      `${this.group.name}-${Date.now().toString()}`
    );
  }

  /**
   * Initializes GroupReportDownloadComponent options with the currently selected filters
   *
   * @param downloader
   */
  initializeDownloader(downloader: GroupReportDownloadComponent): void {
    downloader.options.schoolYear = this.schoolYear;
  }

  private updateRoute(replaceUrl: boolean = false): void {
    this.router.navigate(
      [ this.stateAsNavigationParameters ],
      { replaceUrl }
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

}
