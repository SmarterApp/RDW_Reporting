import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Exam } from "../../../model/exam.model";
import { AssessmentType } from "../../../../shared/enum/assessment-type.enum";
import { StudentReportDownloadComponent } from "../../../../report/student-report-download.component";
import { ReportOptions } from "../../../../report/report-options.model";
import { TranslateService } from "@ngx-translate/core";
import { MenuActionBuilder } from "../../../menu/menu-action.builder";
import { Assessment } from "../../../model/assessment.model";
import { PopupMenuAction } from "@sbac/rdw-reporting-common-ngx";
import { InstructionalResourcesService } from "../../instructional-resources.service";
import { InstructionalResource } from "../../../model/instructional-resources.model";
import { Observable } from "rxjs/Observable";

enum ScoreViewState {
  OVERALL = 1,
  CLAIM = 2
}

@Component({
  selector: 'results-by-student',
  templateUrl: './results-by-student.component.html'
})
export class ResultsByStudentComponent implements OnInit {
  /**
   * The exams to display
   */
  @Input()
  exams: Exam[];

  /**
   * The assessment
   */
  @Input()
  assessment: Assessment;

  /**
   * Represents the cutoff year for when there is no item level response data available.
   * If there are no exams that are after this school year, then disable the ability to go there and show proper message
   */
  @Input()
  minimumItemDataYear: number;

  @ViewChild('menuReportDownloader')
  reportDownloader: StudentReportDownloadComponent;

  actions: PopupMenuAction[];
  instructionalResourcesProvider: () => Observable<InstructionalResource[]>;
  displayState: any = {
    showClaim: ScoreViewState.OVERALL
  };

  get claimCodes() {
    return this.assessment.claimCodes;
  }

  get isClaimScoreSelected() {
    return this.displayState.table == ScoreViewState.CLAIM;
  }

  public setClaimScoreSelected() {
    this.displayState.table = ScoreViewState.CLAIM;
  }

  public setOverallScoreSelected() {
    this.displayState.table = ScoreViewState.OVERALL;
  }

  get performanceLevelHeader() {
    return "labels.groups.results.assessment.exams.cols." +
      (this.isIab ? "iab" : "ica") + ".performance";
  }

  get performanceLevelHeaderInfo() {
    return this.performanceLevelHeader + "-info";
  }

  get examLevelEnum() {
    return this.isIab
      ? "enum.iab-category.full."
      : "enum.achievement-level.full.";
  }

  get assessmentType() {
    return this.assessment.type;
  }

  get isIab() {
    return this.assessmentType == AssessmentType.IAB;
  }

  get isInterim() {
    return this.assessmentType != AssessmentType.SUMMATIVE;
  }

  get showClaimToggle() {
    return !this.isIab;
  }

  constructor(private actionBuilder: MenuActionBuilder,
              private translate: TranslateService,
              private instructionalResourcesService: InstructionalResourcesService) {
  }

  ngOnInit() {
    this.actions = this.createActions();
  }

  loadInstructionalResources(exam: Exam) {
    this.instructionalResourcesProvider = () => this.instructionalResourcesService.getInstructionalResources(this.assessment.id, exam.school.id)
        .map(resources => resources.getResourcesByPerformance(exam.level));
  }

  private createActions(): PopupMenuAction[] {
    let builder = this.actionBuilder.newActions();

    if (this.isInterim) {
      builder.withResponses(exam => exam.id, exam => exam.student, exam => exam.schoolYear > this.minimumItemDataYear);
    }

    return builder
      .withStudentHistory(exam => exam.student)
      .withStudentReport(
        () => this.assessmentType,
        exam => exam.student,
        exam => {
          let downloader: StudentReportDownloadComponent = this.reportDownloader;
          let options: ReportOptions = downloader.options;
          let subject = this.assessment.assessmentSubjectType;

          options.assessmentType = this.assessmentType;
          options.subject = subject;
          options.schoolYear = exam.schoolYear;

          downloader.student = exam.student;
          downloader.title = this.translate.instant('labels.reports.form.title.single-prepopulated', {
            name: exam.student.firstName,
            schoolYear: exam.schoolYear,
            subject: this.translate.instant(`labels.subjects.${subject}.short-name`),
            assessmentType: this.translate.instant(`labels.assessmentTypes.${subject}.short-name`)
          });

          downloader.modal.show();
        }
      )
      .build();
  }
}
