import { Component, Input } from "@angular/core";
import { ReportService } from "./report.service";
import { ReportDownloadComponent } from "./report-download.component";
import { NotificationService } from "../shared/notification/notification.service";
import { Student } from "../student/model/student.model";
import { Report } from "./report.model";
import { Observable } from "rxjs/Observable";
import { ApplicationSettingsService } from "../app-settings.service";
import { StudentNameService } from '../shared/format/student-name.service';
import { SubjectService } from '../subject/subject.service';

/**
 * Component used for single-student exam report download
 */
@Component({
  selector: 'student-report-download,[student-report-download]',
  templateUrl: './report-download.component.html'
})
export class StudentReportDownloadComponent extends ReportDownloadComponent {

  @Input()
  student: Student;

  constructor(notificationService: NotificationService,
              applicationSettingsService: ApplicationSettingsService,
              subjectService: SubjectService,
              private service: ReportService,
              private studentNameService: StudentNameService) {
    super(notificationService, applicationSettingsService, subjectService);
    this.displayOrder = false;
  }

  createReport(): Observable<Report> {
    return this.service.createStudentExamReport(this.student, this.options);
  }

  generateName(): string {
    return this.studentNameService.getDisplayName(this.student);
  }

}
