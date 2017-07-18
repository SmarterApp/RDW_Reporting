import { Component, Input } from "@angular/core";
import { StudentHistoryExamWrapper } from "../../model/student-history-exam-wrapper.model";
import { Student } from "../../model/student.model";
import { PopupMenuAction } from "../../../assessments/menu/popup-menu-action.model";
import { MenuActionBuilder } from "../../../assessments/menu/menu-action.builder";

@Component({
  selector: 'student-history-ica-summitive-table',
  providers: [ MenuActionBuilder ],
  templateUrl: 'student-history-ica-summitive-table.component.html'
})
export class StudentHistoryICASummitiveTableComponent {

  @Input()
  exams: StudentHistoryExamWrapper[] = [];

  @Input()
  student: Student;

  @Input()
  displayState: any = {
    table: 'overall' // ['overall' | 'claim']
  };

  actions: PopupMenuAction[];

  constructor(private actionBuilder: MenuActionBuilder) {
  }

  ngOnInit(): void {
    this.actions = this.createActions();
  }

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

  /**
   * Create table row menu actions.
   *
   * @returns {PopupMenuAction[]} The table row menu actions
   */
  private createActions(): PopupMenuAction[] {
    return this.actionBuilder
      .newActions()
      .withResponses(x => x.exam.id, ()=> this.student)
      .withShowResources(x => x.assessment.name)
      .build();
  }
}
