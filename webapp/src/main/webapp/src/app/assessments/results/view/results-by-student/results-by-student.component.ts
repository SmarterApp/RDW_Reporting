import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Exam } from "../../../model/exam.model";
import { StudentReportDownloadComponent } from "../../../../report/student-report-download.component";
import { ReportOptions } from "../../../../report/report-options.model";
import { TranslateService } from "@ngx-translate/core";
import { MenuActionBuilder } from "../../../menu/menu-action.builder";
import { Assessment } from "../../../model/assessment.model";
import { InstructionalResourcesService } from "../../instructional-resources.service";
import { InstructionalResource } from "../../../model/instructional-resources.model";
import { Observable } from "rxjs/Observable";
import { PopupMenuAction } from "../../../../shared/menu/popup-menu-action.model";
import { Utils } from "../../../../shared/support/support";

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
      (this.assessment.isIab ? "iab" : "ica") + ".performance";
  }

  get performanceLevelHeaderInfo() {
    return this.performanceLevelHeader + "-info";
  }

  get showClaimToggle() {
    return !this.assessment.isIab;
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

  examLevelTranslation(exam: Exam): string {
    return this.assessment.isIab ?
      this.translate.instant(`common.assessment-type.iab.performance-level.${exam.level ? exam.level : 'missing'}.name`) :
      this.translate.instant(`common.assessment-type.ica.performance-level.${exam.level ? exam.level : 'missing'}.name`);
  }

  private createActions(): PopupMenuAction[] {
    const builder = this.actionBuilder.newActions();

    if (this.assessment.isInterim) {
      builder.withResponses(exam => exam.id, exam => exam.student, exam => exam.schoolYear > this.minimumItemDataYear);
    }

    return builder
      .withStudentHistory(exam => exam.student)
      .withStudentReport(
        () => this.assessment.type,
        exam => exam.student,
        exam => {

          const downloader: StudentReportDownloadComponent = this.reportDownloader;
          const options: ReportOptions = downloader.options;
          const subject = Utils.toSubjectCode(this.assessment.assessmentSubjectType);
          const assessmentType = Utils.toAssessmentTypeCode(this.assessment.type);

          options.assessmentType = assessmentType;
          options.subject = subject;
          options.schoolYear = exam.schoolYear;

          downloader.student = exam.student;
          downloader.title = this.translate.instant('labels.reports.form.title.single-prepopulated', {
            name: exam.student.firstName,
            schoolYear: exam.schoolYear,
            subject: this.translate.instant(`common.subject.${subject}.short-name`),
            assessmentType: this.translate.instant(`common.assessment-type.${assessmentType}.short-name`)
          });

          downloader.modal.show();
        }
      )
      .build();
  }
}
