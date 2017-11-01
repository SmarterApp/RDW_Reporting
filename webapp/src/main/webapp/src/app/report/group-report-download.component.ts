import { Component, Input } from "@angular/core";
import { ReportService } from "./report.service";
import { ReportDownloadComponent } from "./report-download.component";
import { NotificationService } from "../shared/notification/notification.service";
import { Report } from "./report.model";
import { Group } from "../user/model/group.model";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

/**
 * Component used for single-student exam report download
 */
@Component({
  selector: 'group-report-download,[group-report-download]',
  templateUrl: './report-download.component.html'
})
export class GroupReportDownloadComponent extends ReportDownloadComponent {

  @Input()
  group: Group;

  constructor(notificationService: NotificationService,
              translateService: TranslateService,
              private service: ReportService) {
    super(notificationService, translateService);
  }

  createReport(): Observable<Report> {
    return this.service.createGroupExamReport(this.group, this.options);
  }

  generateName(): string {
    return this.group.name;
  }

}
