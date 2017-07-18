import { Component, Input, OnInit } from "@angular/core";
import { StudentHistoryExamWrapper } from "../../model/student-history-exam-wrapper.model";
import { Student } from "../../model/student.model";
import { PopupMenuAction } from "../../../assessments/menu/popup-menu-action.model";
import { MenuActionBuilder } from "../../../assessments/menu/menu-action.builder";

@Component({
  selector: 'student-history-iab-table',
  providers: [ MenuActionBuilder ],
  templateUrl: 'student-history-iab-table.component.html'
})
export class StudentHistoryIABTableComponent implements OnInit {

  @Input()
  exams: StudentHistoryExamWrapper[] = [];

  @Input()
  student: Student;

  actions: PopupMenuAction[];

  constructor(private actionBuilder: MenuActionBuilder) {
  }

  ngOnInit(): void {
    this.actions = this.createActions();
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
