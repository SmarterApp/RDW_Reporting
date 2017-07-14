import { Component, Input, OnInit } from "@angular/core";
import { StudentHistoryExamWrapper } from "../../model/student-history-exam-wrapper.model";
import { TranslateService } from "@ngx-translate/core";
import { Student } from "../../model/student.model";
import { PopupMenuAction } from "../../../assessments/menu/popup-menu-action.model";
import { Router, ActivatedRoute } from "@angular/router";
import { exam } from "../../../standalone/data/exam";

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

  constructor(private translateService: TranslateService,
              private router: Router,
              private route: ActivatedRoute) {
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
      let examId: number = wrapper.exam.id;
      this.router.navigate(['exams', examId], { relativeTo: this.route });
    });
    actions.push(responsesAction);

    let resourcesLabel: string = this.translateService.instant('labels.menus.resources');
    let resourcesAction: PopupMenuAction = new PopupMenuAction();
    resourcesAction.displayName = (() => resourcesLabel);
    resourcesAction.perform = ((wrapper) => {
      console.log(`Show Resources: ${wrapper.assessment.name}`)
    }).bind(this);
    actions.push(resourcesAction);

    return actions;
  }

}
