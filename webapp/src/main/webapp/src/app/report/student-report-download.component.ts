import { Component, Input } from "@angular/core";
import { ReportDownloadService } from "./report-download.service";
import { saveAs } from "file-saver";
import { Subscription } from "rxjs";
import { ReportDownloadComponent } from "./report-download.component";
import { Download } from "../shared/data/download.model";

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
  private errorMessage: string;

  constructor(private service: ReportDownloadService) {
    super();
  }

  public submit(): void {

    // Dismiss error state
    this.errorMessage = null;

    // Prevent parallel requests by cancelling current request if active
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }

    // Keep handle on subscription for disabling submit button
    this.subscription = this.service.getStudentExamReport(this.studentId, this.options)
      .subscribe(
        (download: Download) => {
          saveAs(download.content, download.name);
        },
        (error: any) => {
          // TODO: add handler for 404/500 errors
          this.errorMessage = `${error.status}: ${error.statusText}`;
        },
        () => {
          this.subscription = null;
        }
      )
    ;
  }

}
