import { Component, Input } from "@angular/core";
import { ReportService } from "./report.service";
import { ReportDownloadComponent } from "./report-download.component";
import { NotificationService } from "../shared/notification/notification.service";
import { Report } from "./report.model";
import { School } from "../user/model/school.model";
import { Grade } from "../school-grade/grade.model";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";

/**
 * Component used for single-student exam report download
 */
@Component({
  selector: 'school-grade-report-download,[school-grade-report-download]',
  templateUrl: './report-download.component.html'
})
export class SchoolGradeDownloadComponent extends ReportDownloadComponent {

  @Input()
  school: School;

  @Input()
  grade: Grade;

  constructor(notificationService: NotificationService,
              translate: TranslateService,
              private service: ReportService) {
    super(notificationService, translate);
  }

  createReport(): Observable<Report> {
    return this.service.createSchoolGradeExamReport(this.school, this.grade, this.options);
  }

  generateName(): string {
    let gradeLabel: string = this.translateService.instant(`labels.grades.${this.grade.code}.short-name`);
    return `${this.school.name} ${gradeLabel}`;
  }

}
