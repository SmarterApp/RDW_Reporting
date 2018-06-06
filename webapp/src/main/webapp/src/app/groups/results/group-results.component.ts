import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamFilterOptionsService } from '../../assessments/filters/exam-filters/exam-filter-options.service';
import { GroupAssessmentService } from './group-assessment.service';
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

  get group(): Group {
    return this._group;
  }

  set group(value: Group) {
    this._group = value;
    this.createAssessmentExporter();
  }

  get schoolYear(): number {
    return this._schoolYear;
  }

  set schoolYear(value: number) {
    this._schoolYear = value;
    this.createAssessmentExporter();
  }

  get stateAsNavigationParameters(): any {
    const parameters = <any>{
      schoolYear: this.schoolYear
    };
    if (this.group.userCreated) {
      parameters.userGroupId = this.group.id;
    } else {
      parameters.groupId = this.group.id;
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
              assessmentService: GroupAssessmentService,
              private assessmentExportService: GroupAssessmentExportService,
              private translateService: TranslateService) {

    this.assessmentProvider = new GroupAssessmentProvider(assessmentService, this);

  }

  ngOnInit() {
    forkJoin(
      this.groupService.getGroups(),
      this.userGroupService.safelyGetUserGroupsAsGroups(),
      this.filterOptionService.getExamFilterOptions()
    ).subscribe(([ groups, userGroups, filterOptions ]) => {
      this.groups = groups.concat(userGroups)
        .sort(ordering(byString).on<Group>(({ name }) => name).compare);
      this.filterOptions = filterOptions;
      const { groupId, userGroupId, schoolYear } = this.route.snapshot.params;
      this.group = this.groups.find(group => group.userCreated
        ? group.id == userGroupId
        : group.id == groupId
      );
      this.schoolYear = Number.parseInt(schoolYear) || this.filterOptions.schoolYears[ 0 ];
    });
  }

  viewDashboard() {
    this.router.navigate([ 'group-dashboard', this.stateAsNavigationParameters ]);
  }

  updateAssessment(latestAssessment): void {
    this.assessmentExams = [];
    if (latestAssessment) {
      this.assessmentExams = [ latestAssessment ];
    }
  }

  updateRoute(changeSource: string): void {

    this.router.navigate([ this.stateAsNavigationParameters ])
      .then(() => {
        this.updateAssessment(this.route.snapshot.data[ 'assessment' ]);
      });

    // track change event since wiring select boxes on change as HTML attribute is not possible
    this.angulartics2.eventTrack.next({
      action: 'Change' + changeSource,
      properties: {
        category: 'AssessmentResults',
        label: changeSource === 'Group' ? this.group.id : this.schoolYear
      }
    });
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

  private createAssessmentExporter() {
    this.assessmentExporter = new DefaultAssessmentExporter(this.assessmentExportService, this.group.name, this.schoolYear, request =>
      `${this.group.name}-${request.assessment.label}-${this.translateService.instant(request.type.toString())}-${new Date().toDateString()}`
    );
  }

}
