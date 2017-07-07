import { Component, Input } from "@angular/core";
import { StudentHistoryExamWrapper } from "../../model/student-history-exam-wrapper.model";
import { Student } from "../../model/student.model";
import { TranslateService } from "@ngx-translate/core";
import { PopupMenuAction } from "../../../assessments/menu/popup-menu-action.model";

@Component({
  selector: 'student-history-ica-summitive-table',
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

  private responsesLabel: string;
  private resourcesLabel: string;
  private reportLabel: string;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.responsesLabel = this.translateService.instant('labels.menus.responses', this.student);
    this.resourcesLabel = this.translateService.instant('labels.menus.resources');
    this.reportLabel = this.translateService.instant('labels.menus.print-report');
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
    let actions: PopupMenuAction[] = [];

    if (this.exams.length > 0 && !this.exams[0].assessment.isSummative) {
      let responsesAction: PopupMenuAction = new PopupMenuAction();
      responsesAction.displayName = (() => this.responsesLabel).bind(this);
      responsesAction.perform = ((wrapper) => {
        console.log(`Show Responses: ${wrapper.assessment.name}`);
      }).bind(this);
      actions.push(responsesAction);
    }

    let resourcesAction: PopupMenuAction = new PopupMenuAction();
    resourcesAction.displayName = (() => this.resourcesLabel).bind(this);
    resourcesAction.perform = ((wrapper) => {
      console.log(`Show Resources: ${wrapper.assessment.name}`)
    }).bind(this);
    actions.push(resourcesAction);

    let reportAction: PopupMenuAction = new PopupMenuAction();
    reportAction.displayName = (() => this.reportLabel).bind(this);
    reportAction.perform = ((wrapper) => {
      console.log(`Print Report: ${wrapper.assessment.name}`)
    }).bind(this);
    actions.push(reportAction);

    return actions;
  }

}
