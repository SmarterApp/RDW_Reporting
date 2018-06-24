import { EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ReportOptions } from "./report-options.model";
import { NotificationService } from "../shared/notification/notification.service";
import { ReportOrder } from "./report-order.enum";
import { ModalDirective } from "ngx-bootstrap";
import { Observable } from "rxjs/Observable";
import { Report } from "./report.model";
import { ApplicationSettingsService } from '../app-settings.service';
import { SubjectService } from '../subject/subject.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

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
  assessmentType: string;

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

  assessmentTypes: string[] = [ undefined, 'ica', 'iab', 'sum' ];
  subjectTypes: string[] = [];
  orders: ReportOrder[] = [ ReportOrder.STUDENT_NAME, ReportOrder.STUDENT_SSID ];
  options: ReportOptions;
  reportLanguages: string[] = [ 'en' ];
  transferAccess: boolean;

  constructor(protected notificationService: NotificationService,
              protected applicationSettingsService: ApplicationSettingsService,
              protected subjectService: SubjectService) {
  }

  ngOnInit(): void {

    forkJoin(
      this.subjectService.getSubjectCodes(),
      this.applicationSettingsService.getSettings()
    ).subscribe(([subjectCodes, settings]) => {
      // undefined represents the All option and is included first
      this.subjectTypes = [undefined, ...subjectCodes];

      const defaultOptions: ReportOptions = new ReportOptions();
      defaultOptions.assessmentType = this.assessmentType != null ? this.assessmentType : this.assessmentTypes[ 0 ];
      defaultOptions.subject = this.subject != null ? this.subject : this.subjectTypes[ 0 ];
      defaultOptions.schoolYear = this.schoolYear != null ? this.schoolYear : this.schoolYears[ 0 ];
      defaultOptions.language = this.reportLanguages[ 0 ];
      defaultOptions.accommodationsVisible = false;
      defaultOptions.order = this.orders[ 0 ];
      defaultOptions.grayscale = false;
      defaultOptions.disableTransferAccess = false;
      this.options = defaultOptions;

      this.reportLanguages = this.reportLanguages.concat(settings.reportLanguages);
      this.transferAccess = settings.transferAccess;
    });
  }

  submit(): void {
    this.createReport()
      .subscribe(
        () => {
          this.notificationService.info({ id: 'report-download.submitted-message', html: true });
        },
        () => {
          this.notificationService.error({ id: 'common.messages.submission-failed', html: true });
        }
      );
  }

  onShowInternal(event: any) {
    this.onShow.emit(event);
    this.options.name = this.generateName();
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

}
