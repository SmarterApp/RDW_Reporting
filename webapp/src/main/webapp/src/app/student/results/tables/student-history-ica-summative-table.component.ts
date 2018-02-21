import { Component, Input, OnInit } from "@angular/core";
import { StudentHistoryExamWrapper } from "../../model/student-history-exam-wrapper.model";
import { Student } from "../../model/student.model";
import { MenuActionBuilder } from "../../../assessments/menu/menu-action.builder";
import { PopupMenuAction } from "../../../shared/menu/popup-menu-action.model";
import { TranslateService } from "@ngx-translate/core";
import { AssessmentType } from "../../../shared/enum/assessment-type.enum";

@Component({
  selector: 'student-history-ica-summative-table',
  providers: [ MenuActionBuilder ],
  templateUrl: 'student-history-ica-summative-table.component.html'
})
export class StudentHistoryICASummativeTableComponent implements OnInit {

  @Input()
  exams: StudentHistoryExamWrapper[] = [];

  @Input()
  student: Student;

  @Input()
  type: AssessmentType;

  /**
   * Represents the cutoff year for when there is no item level response data available.
   * If there are no exams that are after this school year, then disable the ability to go there and show proper message
   */
  @Input()
  minimumItemDataYear: number;

  @Input()
  displayState: any = {
    table: 'overall' // ['overall' | 'claim']
  };

  actions: PopupMenuAction[];

  constructor(private actionBuilder: MenuActionBuilder,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    if (this.type === AssessmentType.ICA) {
      this.actions = this.createIcaActions();
    } else if (this.type === AssessmentType.SUMMATIVE) {
      this.actions = this.createSummativeActions();
    }
  }

  /**
   * Sample the "first" assessment for the available claimCode codes,
   * with an understanding that all assessments within a subject
   * contain the same claims in the same order.
   *
   * @returns {string[]} The claimCode codes for this table.
   */
  public getClaims(): string[] {
    return this.exams.length
      ? this.exams[ 0 ].assessment.claimCodes
      : [];
  }

  /**
   * Create table row menu actions.
   *
   * @returns {PopupMenuAction[]} The table row menu actions
   */
  private createIcaActions(): PopupMenuAction[] {
    return this.actionBuilder.newActions()
      .withResponses(x => x.exam.id, () => this.student, x => x.exam.schoolYear > this.minimumItemDataYear)
      .build();
  }

  private createSummativeActions(): PopupMenuAction[] {
    const menuAction: PopupMenuAction = new PopupMenuAction();
    menuAction.displayName = () => {
      return this.translateService.instant('labels.menus.responses', this.student);
    };
    menuAction.tooltip = () => {
      return this.translateService.instant('messages.no-responses-for-summative-exams');
    };
    menuAction.isDisabled = () => {
      return true;
    };
    return [ menuAction ];
  }
}
