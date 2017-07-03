import { Component, Input } from "@angular/core";
import { StudentHistoryExamWrapper } from "../../model/student-history-exam-wrapper.model";

@Component({
  selector: 'student-history-ica-summitive-table',
  templateUrl: 'student-history-ica-summitive-table.component.html'
})
export class StudentHistoryICASummitiveTableComponent {

  @Input()
  exams: StudentHistoryExamWrapper[] = [];

  @Input()
  displayState: any = {
    table: 'overall' // ['overall' | 'claim']
  };

  /**
   * Sample the "first" assessment for the available claim codes,
   * with an understanding that all assessments within a subject
   * contain the same claims in the same order.
   *
   * @returns {string[]} The claim codes for this table.
   */
  public getClaims(): string[] {
    if (this.exams.length === 0) return [];

    return this.exams[0].assessment.claimCodes;
  }
}
