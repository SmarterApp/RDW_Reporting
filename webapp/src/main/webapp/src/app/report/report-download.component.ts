import { OnInit, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { ReportOptions } from "./report-options.model";
import { saveAs } from "file-saver";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";
import { NotificationService } from "../shared/notification/notification.service";
import { ReportOrder } from "./report-order.enum";
import { PopoverDirective } from "ngx-bootstrap";

/**
 * Abstract class used to carry the common logic between all exam report download components
 */
export abstract class ReportDownloadComponent implements OnInit {

  @ViewChild('downloadPopover')
  protected popover: PopoverDirective;

  @Input()
  public schoolYears: number[];

  @Input()
  public batch: boolean = false;

  @Input()
  public disabled: boolean = false;

  @Output()
  public onShown: EventEmitter<any> = new EventEmitter<any>();

  public onShownInternal(event: any) {
    this.onShown.emit(event);
  }

  public assessmentTypes: AssessmentType[] = [ AssessmentType.IAB, AssessmentType.ICA ];
  public subjectTypes: AssessmentSubjectType[] = [ AssessmentSubjectType.MATH, AssessmentSubjectType.ELA ];
  public languages: string[] = [ 'eng', 'spa', 'vie' ];
  public orders: ReportOrder[] = [ ReportOrder.STUDENT_NAME, ReportOrder.STUDENT_SSID ];
  public options: ReportOptions;

  constructor(private buttonLabel: string, protected notificationService: NotificationService) {
  }

  ngOnInit(): void {
    let defaultOptions: ReportOptions = new ReportOptions();
    defaultOptions.assessmentType = this.batch ? null : this.assessmentTypes[ 0 ];
    defaultOptions.subject = this.batch ? null : this.subjectTypes[ 0 ];
    defaultOptions.schoolYear = this.schoolYears[ 0 ];
    defaultOptions.language = this.languages[ 0 ];
    defaultOptions.order = this.orders[ 0 ];
    defaultOptions.grayscale = false;
    this.options = defaultOptions;
  }
  
  /**
   * Implement this to give behavior to the exam report download form when it is submitted
   */
  public abstract submit(): void;

}
