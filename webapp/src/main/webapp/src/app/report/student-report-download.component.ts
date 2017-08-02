import { Component, Input } from "@angular/core";
import { ReportService } from "./report.service";
import { saveAs } from "file-saver";
import { Subscription } from "rxjs";
import { ReportDownloadComponent } from "./report-download.component";
import { Download } from "../shared/data/download.model";
import { NotificationService } from "../shared/notification/notification.service";
import { Notification } from "../shared/notification/notification.model";

/**
 * Component used for single-student exam report download
 */
@Component({
  selector: 'student-report-download',
  templateUrl: './report-download.component.html'
})
export class StudentReportDownloadComponent extends ReportDownloadComponent {

  @Input()
  public studentId: number;

  private subscription: Subscription;

  constructor(private service: ReportService, private notificationService: NotificationService) {
    super();
  }

  public submit(): void {

    // Keep handle on subscription for disabling submit button
    this.subscription = this.service.getStudentExamReport(this.studentId, this.options)
      .subscribe(
        (download: Download) => {
          saveAs(download.content, download.name);
        },
        (error: any) => {
          let messageKey = "labels.reports.messages.500";

          if (error.status == 404) {
            messageKey = "labels.reports.messages.404";
          }

          this.notificationService.showNotification(new Notification(messageKey, { type: "danger" }));

          this.subscription = null;
        },
        () => {
          this.subscription = null;
        }
      )
    ;
  }

}
