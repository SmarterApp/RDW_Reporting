import { OnInit, Input } from "@angular/core";
import { ReportOptions } from "./report-options.model";
import { saveAs } from "file-saver";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";

/**
 * Abstract class used to carry the common logic between all exam report download components
 */
export abstract class ReportDownloadComponent implements OnInit {

  @Input()
  public schoolYears: Array<number>;

  public assessmentTypes: Array<AssessmentType> = [ AssessmentType.IAB, AssessmentType.ICA ];
  public subjectTypes: Array<AssessmentSubjectType> = [ AssessmentSubjectType.MATH, AssessmentSubjectType.ELA ];
  public languages: Array<string> = [ 'eng', 'spa', 'vie' ];
  public options: ReportOptions;

  ngOnInit(): void {
    let defaultOptions: ReportOptions = new ReportOptions();
    defaultOptions.assessmentType = this.assessmentTypes[ 0 ];
    defaultOptions.subject = this.subjectTypes[ 0 ];
    defaultOptions.schoolYear = this.schoolYears[ 0 ];
    defaultOptions.language = this.languages[ 0 ];
    defaultOptions.grayscale = false;
    this.options = defaultOptions;
  }

  /**
   * Implement this to give behavior to the exam report download form when it is submitted
   */
  public abstract submit(): void;

}
