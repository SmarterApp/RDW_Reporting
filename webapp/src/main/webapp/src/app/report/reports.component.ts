import { OnInit, Component } from "@angular/core";
import { saveAs } from "file-saver";
import { Report } from "./report.model";
import { ActivatedRoute } from "@angular/router";
import { ReportService } from "./report.service";
import { Download } from "../shared/data/download.model";
import { NotificationService } from "../shared/notification/notification.service";

/**
 * Responsible for controlling the behavior of the reports page
 */
@Component({
  selector: 'reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {

  public reports: Report[];

  constructor(private route: ActivatedRoute, private service: ReportService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.reports = this.route.snapshot.data[ 'reports' ];
  }

  public getReport(report: Report) {

    this.service.getBatchExamReport(report.id)
      .subscribe(
        (download: Download) => {
          saveAs(download.content, download.name);
        },
        (error: any) => {
          this.notificationService.error({id: 'labels.reports.messages.download-failed'});
        }
      );
  }

}
