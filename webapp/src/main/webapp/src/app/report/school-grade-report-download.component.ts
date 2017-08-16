import { Component, Input } from "@angular/core";
import { ReportService } from "./report.service";
import { saveAs } from "file-saver";
import { ReportDownloadComponent } from "./report-download.component";
import { NotificationService } from "../shared/notification/notification.service";
import { Report } from "./report.model";
import { School } from "../user/model/school.model";
import { Grade } from "../school-grade/grade.model";
import { TranslateService } from "@ngx-translate/core";

/**
 * Component used for single-student exam report download
 */
@Component({
  selector: 'school-grade-report-download,[school-grade-report-download]',
  templateUrl: './report-download.component.html'
})
export class SchoolGradeDownloadComponent extends ReportDownloadComponent {

  @Input()
  public school: School;

  @Input()
  public grade: Grade;

  constructor(private service: ReportService, notificationService: NotificationService, private translate: TranslateService) {
    super('labels.reports.button-label.school-grade', notificationService);
    this.batch = true;
  }

  public submit(): void {

    this.popover.hide();

    this.options.name = this.getName();

    this.service.createSchoolGradeExamReport(this.school.id, this.grade.id, this.options)
      .subscribe(
        (report: Report) => {
          this.notificationService.info({ id: 'labels.reports.messages.create.success-html', html: true });
        },
        (error: any) => {
          this.notificationService.error({
            id: error.name === 'NotFoundError'
              ? 'labels.reports.messages.create.school-grade-no-content'
              : 'labels.reports.messages.create.error'
          });
        }
      );
  }

  private getName(): string {
    return [
      this.school.name,
      this.translate.instant(`labels.grades.${this.grade.code}.short-name`),
      this.options.schoolYear.toString(),
      this.options.language === this.languages[ 0 ]
        ? '' : this.translate.instant(`labels.languages.${this.options.language}.default`)
    ].join(' ').trim();
  }

}
