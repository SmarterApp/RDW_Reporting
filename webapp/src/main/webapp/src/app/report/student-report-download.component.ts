import { Component, Input } from "@angular/core";
import { ReportService } from "./report.service";
import { saveAs } from "file-saver";
import { ReportDownloadComponent } from "./report-download.component";
import { Download } from "../shared/data/download.model";
import { NotificationService } from "../shared/notification/notification.service";

/**
 * Component used for single-student exam report download
 */
@Component({
  selector: 'student-report-download,[student-report-download]',
  templateUrl: './report-download.component.html'
})
export class StudentReportDownloadComponent extends ReportDownloadComponent {

  @Input()
  public studentId: number;

  constructor(private service: ReportService, notificationService: NotificationService) {
    super('labels.reports.button-label.student', notificationService);
  }

  public submit(): void {

    this.popover.hide();

    this.service.getStudentExamReport(this.studentId, this.options)
      .subscribe(
        (download: Download) => {
          saveAs(download.content, download.name);
        },
        (error: any) => {
          this.notificationService.error({
            id: error.name === 'NotFoundError'
              ? 'labels.reports.messages.create.student-no-content'
              : 'labels.reports.messages.get.error'
          });
        }
      )
    ;
  }

}
