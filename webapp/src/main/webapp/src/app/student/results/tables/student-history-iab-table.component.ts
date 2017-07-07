import { Component, Input, OnInit } from "@angular/core";
import { StudentHistoryExamWrapper } from "../../model/student-history-exam-wrapper.model";
import { TranslateService } from "@ngx-translate/core";
import { Student } from "../../model/student.model";
import { PopupMenuAction } from "../../../assessments/menu/popup-menu-action.model";

@Component({
  selector: 'student-history-iab-table',
  templateUrl: 'student-history-iab-table.component.html'
})
export class StudentHistoryIABTableComponent implements OnInit {

  @Input()
  exams: StudentHistoryExamWrapper[] = [];

  @Input()
  student: Student;

  actions: PopupMenuAction[];

  constructor(private translateService: TranslateService) {
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
    let actions: PopupMenuAction[] = [];

    let responsesLabel: string = this.translateService.instant('labels.menus.responses', this.student);
    let responsesAction: PopupMenuAction = new PopupMenuAction();
    responsesAction.displayName = (() => responsesLabel);
    responsesAction.perform = ((wrapper) => {
      console.log(`Show Responses: ${wrapper.assessment.name}`);
    }).bind(this);
    actions.push(responsesAction);

    let resourcesLabel: string = this.translateService.instant('labels.menus.resources');
    let resourcesAction: PopupMenuAction = new PopupMenuAction();
    resourcesAction.displayName = (() => resourcesLabel);
    resourcesAction.perform = ((wrapper) => {
      console.log(`Show Resources: ${wrapper.assessment.name}`)
    }).bind(this);
    actions.push(resourcesAction);

    let reportLabel: string = this.translateService.instant('labels.menus.print-report');
    let reportAction: PopupMenuAction = new PopupMenuAction();
    reportAction.displayName = (() => reportLabel);
    reportAction.perform = ((wrapper) => {
      console.log(`Print Report: ${wrapper.assessment.name}`)
    }).bind(this);
    actions.push(reportAction);

    return actions;
  }

}
