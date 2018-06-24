import { Component, Input } from "@angular/core";
import { ReportService } from "./report.service";
import { ReportDownloadComponent } from "./report-download.component";
import { NotificationService } from "../shared/notification/notification.service";
import { Report } from "./report.model";
import { Grade } from "../school-grade/grade.model";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";
import { ApplicationSettingsService } from '../app-settings.service';
import { School } from "../shared/organization/organization";
import { SubjectService } from '../subject/subject.service';

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
              applicationSettingsService: ApplicationSettingsService,
              subjectService: SubjectService,
              private service: ReportService,
              private translate: TranslateService) {
    super(notificationService, applicationSettingsService, subjectService);
  }

  createReport(): Observable<Report> {
    return this.service.createSchoolGradeExamReport(this.school, this.grade, this.options);
  }

  generateName(): string {
    const gradeLabel: string = this.translate.instant(`common.assessment-grade-short-label.${this.grade.code}`);
    return `${this.school.name} ${gradeLabel}`;
  }

}
