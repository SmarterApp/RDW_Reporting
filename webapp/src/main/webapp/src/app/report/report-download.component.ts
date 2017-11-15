import { EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ReportOptions } from "./report-options.model";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";
import { NotificationService } from "../shared/notification/notification.service";
import { ReportOrder } from "./report-order.enum";
import { ModalDirective } from "ngx-bootstrap";
import { Observable } from "rxjs";
import { Report } from "./report.model";
import { UserService } from "../user/user.service";
import { isNullOrUndefined } from "util";

/**
 * Abstract class used to carry the common logic between all exam report download components
 */
export abstract class ReportDownloadComponent implements OnInit {

  @Input()
  title: string = '';

  @Input()
  schoolYears: number[] = [];

  @Input()
  schoolYear: number;

  @Input()
  lockSchoolYear: boolean = false;

  @Input()
  assessmentType: AssessmentType = null;

  @Input()
  lockAssessmentType: boolean = false;

  @Input()
  subject: string;

  @Input()
  lockSubject: boolean = false;

  @Input()
  displayOrder: boolean = true;

  @ViewChild('modal')
  modal: ModalDirective;

  @Output()
  onShow: EventEmitter<any> = new EventEmitter<any>();

  onShowInternal(event: any) {
    this.onShow.emit(event);
    this.options.name = this.generateName();
  }

  AssessmentType: any = AssessmentType;
  assessmentTypes: AssessmentType[] = [ null, AssessmentType.IAB, AssessmentType.ICA ];
  subjectTypes: AssessmentSubjectType[] = [ null, AssessmentSubjectType.MATH, AssessmentSubjectType.ELA ];
  orders: ReportOrder[] = [ ReportOrder.STUDENT_NAME, ReportOrder.STUDENT_SSID ];
  options: ReportOptions;
  reportLanguages: string[] = ['en'];
  transferAccess: boolean;

  constructor(protected notificationService: NotificationService,
              protected userService: UserService) {
  }

  ngOnInit(): void {
    let defaultOptions: ReportOptions = new ReportOptions();
    defaultOptions.assessmentType = this.assessmentType != null ? this.assessmentType : this.assessmentTypes[ 0 ];
    defaultOptions.subject = this.subject != null ? this.getSubjectFromString(this.subject) : this.subjectTypes[ 0 ];
    defaultOptions.schoolYear = this.schoolYear != null ? this.schoolYear : this.schoolYears[ 0 ];
    defaultOptions.language = this.reportLanguages[0];
    defaultOptions.accommodationsVisible = false;
    defaultOptions.order = this.orders[ 0 ];
    defaultOptions.grayscale = false;
    defaultOptions.disableTransferAccess = false;
    this.options = defaultOptions;

    this.userService.getCurrentUser().subscribe(user => {
      if (!isNullOrUndefined(user)) {
        this.reportLanguages = this.reportLanguages.concat(user.configuration.reportLanguages);
        this.transferAccess = user.configuration.transferAccess;
      }
    });
  }

  submit(): void {
    this.createReport()
      .subscribe(
        () => {
          this.notificationService.info({ id: 'labels.reports.messages.submitted.html', html: true });
        },
        () => {
          this.notificationService.error({ id: 'labels.reports.messages.submission-failed.html', html: true });
        }
      );
  }

  /**
   * Implement this to give behavior to the exam report download form when it is submitted
   */
  abstract createReport(): Observable<Report>;

  /**
   * Generate a default report name to suggest to the user.
   *
   * @returns {string} The default report name
   */
  abstract generateName(): string;

  /**
   * Converts the given string to an AssessmentSubjectType
   *
   * @param value the AssessmentSubjectType name
   * @returns the AssessmentSubjectType for the given string assessment type name
   */
  private getSubjectFromString(value: string): AssessmentSubjectType {
    return value === '' ? null : AssessmentSubjectType[value];
  }

}
