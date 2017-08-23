import { Component, Input } from "@angular/core";
import { ReportService } from "./report.service";
import { saveAs } from "file-saver";
import { ReportDownloadComponent } from "./report-download.component";
import { Download } from "../shared/data/download.model";
import { NotificationService } from "../shared/notification/notification.service";
import { Student } from "../student/model/student.model";

/**
 * Component used for single-student exam report download
 */
@Component({
  selector: 'student-report-download,[student-report-download]',
  templateUrl: './report-download.component.html'
})
export class StudentReportDownloadComponent extends ReportDownloadComponent {

  @Input()
  public student: Student;

  constructor(private service: ReportService, notificationService: NotificationService) {
    super('labels.reports.button-label.student', notificationService);
  }

  public submit(): void {

    this.popover.hide();

    this.notificationService.info({ id: 'labels.reports.messages.submitted-single' });

    this.service.getStudentExamReport(this.student.id, this.options)
      .subscribe(
        (download: Download) => {
          saveAs(download.content, download.name);
        },
        (error: any) => {
          this.notificationService.error({
            id: error.name === 'NotFoundError'
              ? 'labels.reports.messages.404'
              : 'labels.reports.messages.500'
          });
        }
      )
    ;
  }

}
