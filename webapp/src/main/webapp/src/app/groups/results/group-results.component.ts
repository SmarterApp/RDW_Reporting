import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AssessmentExam } from "../../assessments/model/assessment-exam.model";
import { ExamFilterOptions } from "../../assessments/model/exam-filter-options.model";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { GroupAssessmentService } from "./group-assessment.service";
import { Angulartics2 } from "angulartics2";
import { AssessmentsComponent } from "../../assessments/assessments.component";
import { CsvExportService } from "../../csv-export/csv-export.service";
import { GroupReportDownloadComponent } from "../../report/group-report-download.component";
import { Group } from "../../user/model/group.model";
import { GroupAssessmentExportService } from "./group-assessment-export.service";

@Component({
  selector: 'app-group-results',
  templateUrl: './group-results.component.html',
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
    if(this._currentGroup) {
      this.assessmentProvider.group = this._currentGroup;
      this.assessmentExporter.group = this._currentGroup;
    }
  }

  get currentSchoolYear() {
    return this._currentSchoolYear;
  }

  set currentSchoolYear(value) {
    this._currentSchoolYear = value;
    this.assessmentProvider.schoolYear = value;
  }

  private _currentGroup;
  private _currentSchoolYear;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private filterOptionService: ExamFilterOptionsService,
              private angulartics2: Angulartics2,
              private csvExportService: CsvExportService,
              public assessmentProvider: GroupAssessmentService,
              public assessmentExporter: GroupAssessmentExportService) {
  }

  ngOnInit() {
    this.groups = this.route.snapshot.data[ "user" ].groups;
    this.currentGroup = this.groups.find(x => x.id == this.route.snapshot.params[ "groupId" ]);

    this.filterOptionService.getExamFilterOptions().subscribe(filterOptions => {
      this.filterOptions = filterOptions;
      this.currentSchoolYear = this.mapParamsToSchoolYear(this.route.snapshot.params);
    });

    this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
  }

  updateAssessment(latestAssessment) {
    this.assessmentExams = [];

    if (latestAssessment) {
      this.assessmentExams.push(latestAssessment);
    }
  }

  updateRoute(changeSource: string) {
    this.router.navigate([ 'groups', this._currentGroup.id, { schoolYear: this._currentSchoolYear, } ]).then(() => {
      this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
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

  mapParamsToSchoolYear(params) {
    return Number.parseInt(params[ "schoolYear" ]) || this.filterOptions.schoolYears[ 0 ];
  }

  exportCsv(): void {
    let filename: string = this.currentGroup.name +
      "-" + new Date().toDateString();

    this.angulartics2.eventTrack.next({
      action: 'Export Group Results',
      properties: {
        category: 'Export'
      }
    });

    this.csvExportService.exportAssessmentExams(this.assessmentsComponent.assessmentExams, this.assessmentsComponent.clientFilterBy, this.filterOptions.ethnicities, filename);
  }

  /**
   * Initializes GroupReportDownloadComponent options with the currently selected filters
   *
   * @param downloader
   */
  private initializeDownloader(downloader: GroupReportDownloadComponent): void {
    downloader.options.schoolYear = this.currentSchoolYear;
  }

}
