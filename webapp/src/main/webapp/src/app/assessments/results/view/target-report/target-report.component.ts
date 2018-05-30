import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Exam } from '../../../model/exam.model';
import { StudentReportDownloadComponent } from '../../../../report/student-report-download.component';
import { ReportOptions } from '../../../../report/report-options.model';
import { TranslateService } from '@ngx-translate/core';
import { MenuActionBuilder } from '../../../menu/menu-action.builder';
import { Assessment } from '../../../model/assessment.model';
import { InstructionalResourcesService } from '../../instructional-resources.service';
import { PopupMenuAction } from '../../../../shared/menu/popup-menu-action.model';

// TODO replace this stub

@Component({
  selector: 'target-report',
  templateUrl: './target-report.component.html'
})
export class TargetReportComponent implements OnInit {
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

  @Input()
  showClaimScores: boolean;

  @ViewChild('menuReportDownloader')
  reportDownloader: StudentReportDownloadComponent;

  columns: Column[];
  actions: PopupMenuAction[];

  constructor(private actionBuilder: MenuActionBuilder,
              private translate: TranslateService,
              private instructionalResourcesService: InstructionalResourcesService) {
  }

  ngOnInit() {
    this.columns = [
      new Column({ id: 'claim', headerInfo: true }),
      new Column({ id: 'target', headerInfo: true }),
      new Column({ id: 'subgroup', headerInfo: true }),
      new Column({ id: 'students-tested' }),
      new Column({ id: 'student-relative-residual-scores-level', headerInfo: true }),
      new Column({ id: 'standard-met-relative-residual-level', headerInfo: true })
    ];
    this.actions = this.createActions();
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
          const subject = this.assessment.subject;
          const assessmentType = this.assessment.type;

          options.assessmentType = assessmentType;
          options.subject = subject;
          options.schoolYear = exam.schoolYear;

          downloader.student = exam.student;
          downloader.title = this.translate.instant('results-by-student.create-single-prepopulated-report', {
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

class Column {
  id: string;
  field: string;
  headerInfo: boolean;

  constructor({
                id,
                field = '',
                headerInfo = false,
              }) {
    this.id = id;
    this.field = field ? field : id;
    this.headerInfo = headerInfo;
  }
}
