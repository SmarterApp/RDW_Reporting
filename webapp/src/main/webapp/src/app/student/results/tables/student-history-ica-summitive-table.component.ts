import { Component, Input } from "@angular/core";
import { StudentHistoryExamWrapper } from "../../model/student-history-exam-wrapper.model";
import { Student } from "../../model/student.model";
import { TranslateService } from "@ngx-translate/core";
import { PopupMenuAction } from "../../../assessments/menu/popup-menu-action.model";
import { ActivatedRoute, Router } from "@angular/router";

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

  constructor(private translateService: TranslateService,
              private router: Router,
              private route: ActivatedRoute) {
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
    let actions: PopupMenuAction[] = [];

    if (this.exams.length > 0 && !this.exams[0].assessment.isSummative) {
      let responsesLabel: string = this.translateService.instant('labels.menus.responses', this.student);
      let responsesAction: PopupMenuAction = new PopupMenuAction();
      responsesAction.displayName = (() => responsesLabel);
      responsesAction.perform = ((wrapper) => {
        let examId: number = wrapper.exam.id;
        this.router.navigate(['exams', examId], { relativeTo: this.route });
      });
      actions.push(responsesAction);
    }

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
