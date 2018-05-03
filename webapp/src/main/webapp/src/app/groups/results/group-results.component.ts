import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentExam } from '../../assessments/model/assessment-exam.model';
import { ExamFilterOptions } from '../../assessments/model/exam-filter-options.model';
import { ExamFilterOptionsService } from '../../assessments/filters/exam-filters/exam-filter-options.service';
import { GroupAssessmentService } from './group-assessment.service';
import { Angulartics2 } from 'angulartics2';
import { AssessmentsComponent } from '../../assessments/assessments.component';
import { CsvExportService } from '../../csv-export/csv-export.service';
import { GroupReportDownloadComponent } from '../../report/group-report-download.component';
import { Group } from '../../groups/group';
import { GroupAssessmentExportService } from './group-assessment-export.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { GroupService } from '../group.service';

@Component({
  selector: 'group-results',
  templateUrl: './group-results.component.html'
})
export class GroupResultsComponent implements OnInit {

  @ViewChild(AssessmentsComponent)
  assessmentsComponent: AssessmentsComponent;

  groups: Group[];
  assessmentExams: AssessmentExam[] = [];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();

  get currentGroup(): Group {
    return this._currentGroup;
  }

  set currentGroup(value: Group) {
    this._currentGroup = value;
    if (this._currentGroup) {
      this.assessmentProvider.group = this._currentGroup;
      this.assessmentExporter.group = this._currentGroup;
    }
  }

  get currentSchoolYear(): number {
    return this._currentSchoolYear;
  }

  set currentSchoolYear(value: number) {
    this._currentSchoolYear = value;
    this.assessmentProvider.schoolYear = value;
  }

  private _currentGroup;
  private _currentSchoolYear: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private groupService: GroupService,
              private filterOptionService: ExamFilterOptionsService,
              private angulartics2: Angulartics2,
              private csvExportService: CsvExportService,
              public assessmentProvider: GroupAssessmentService,
              public assessmentExporter: GroupAssessmentExportService) {
  }

  ngOnInit() {
    forkJoin(
      this.groupService.getGroups(),
      this.filterOptionService.getExamFilterOptions()
    ).subscribe(([ groups, filterOptions ]) => {
      this.groups = groups;
      this.filterOptions = filterOptions;
      const { groupId, schoolYear, assessmentIds } = this.route.snapshot.params;
      this.currentGroup = this.groups.find(group => group.id == groupId);
      this.currentSchoolYear = Number.parseInt(schoolYear) || this.filterOptions.schoolYears[ 0 ];
    });
  }

  viewDashboard() {
    this.router.navigate([ 'group-dashboard', this.currentGroup.id, {
      schoolYear: this.currentSchoolYear
    } ]);
  }

  updateAssessment(latestAssessment): void {
    this.assessmentExams = [];
    if (latestAssessment) {
      this.assessmentExams = [ latestAssessment ];
    }
  }

  updateRoute(changeSource: string): void {
    this.router.navigate([ 'groups', this._currentGroup.id, { schoolYear: this._currentSchoolYear } ])
      .then(() => {
        this.updateAssessment(this.route.snapshot.data[ 'assessment' ]);
      });

    // track change event since wiring select boxes on change as HTML attribute is not possible
    this.angulartics2.eventTrack.next({
      action: 'Change' + changeSource,
      properties: {
        category: 'AssessmentResults',
        label: changeSource === 'Group' ? this._currentGroup.id : this._currentSchoolYear
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
      `${this.currentGroup.name}-${Date.now().toString()}`
    );
  }

  /**
   * Initializes GroupReportDownloadComponent options with the currently selected filters
   *
   * @param downloader
   */
  initializeDownloader(downloader: GroupReportDownloadComponent): void {
    downloader.options.schoolYear = this.currentSchoolYear;
  }

}
