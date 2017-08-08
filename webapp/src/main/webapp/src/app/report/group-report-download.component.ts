import { Component, Input } from "@angular/core";
import { ReportService } from "./report.service";
import { saveAs } from "file-saver";
import { ReportDownloadComponent } from "./report-download.component";
import { NotificationService } from "../shared/notification/notification.service";
import { Report } from "./report.model";
import { Group } from "../user/model/group.model";
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
  public group: Group;

  constructor(private service: ReportService, notificationService: NotificationService, private translate: TranslateService) {
    super('labels.reports.button-label.group', notificationService);
    this.batch = true;
  }

  public submit(): void {

    this.popover.hide();

    this.options.name = this.getName();

    this.service.createGroupExamReport(this.group.id, this.options)
      .subscribe(
        (report: Report) => {
          this.notificationService.info({ id: 'labels.reports.messages.submitted.html', html: true });
        },
        (error: any) => {
          this.notificationService.error({ id: 'labels.reports.messages.submission-failed.html', html: true });
        }
      );
  }

  private getName(): string {
    return [
      this.group.name,
      this.options.schoolYear.toString(),
      this.options.language === this.languages[ 0 ]
        ? '' : this.translate.instant(`labels.languages.${this.options.language}.default`)
    ].join(' ').trim();
  }

}
