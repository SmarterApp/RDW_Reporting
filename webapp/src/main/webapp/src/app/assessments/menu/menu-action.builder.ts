import { Injectable } from "@angular/core";
import { PopupMenuAction } from "./popup-menu-action.model";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Student } from "../../student/model/student.model";

/**
 * This builder will create the menu actions used by the PopupMenuComponent.
 *
 * Methods are chained and must begin with .newActions() and end with .build()
 *
 * This class must be added as a provider to the Component in order for the relativeTo: this.route
 * to be relative to that component's route.
 */
@Injectable()
export class MenuActionBuilder {
  private actions: PopupMenuAction[];

  constructor(private translateService: TranslateService,
              private route: ActivatedRoute,
              private router: Router){
    this.actions = [];
  }

  newActions(): MenuActionBuilder {
    return new MenuActionBuilder(this.translateService, this.route, this.router);
  }

  /**
   * Adds an action which navigates to the Student's Exam History
   *
   * @param getStudent lambda which accesses the student from the actionable object.
   * @returns {MenuActionBuilder}
   */
  withStudentHistory(getStudent: (s:any) => Student): MenuActionBuilder {
    let action: PopupMenuAction = new PopupMenuAction();

    action.displayName = ((actionable: any) => {
      return this.translateService.instant('labels.menus.test-history', getStudent(actionable));
    }).bind(this);
    action.perform = ((actionable: any) => {
      this.router.navigate(['students', getStudent(actionable).id], { relativeTo: this.route });
    }).bind(this);

    this.actions.push(action);
    return this;
  }

  /**
   * Adds an action which navigates to the Student's Responses
   *
   * @param getStudent lambda which accesses the student from the actionable object.
   * @param getExamId lambda which accesses the examId from the actionable object.
   * @returns the builder
   */
  withResponses(getExamId: (x:any) => number, getStudent: (x:any) => Student): MenuActionBuilder {
    let responsesAction: PopupMenuAction = new PopupMenuAction();

    responsesAction.displayName = ((actionable: any) => {
      return this.translateService.instant('labels.menus.responses', getStudent(actionable));
    }).bind(this);
    responsesAction.perform = ((actionable: any) => {
      let commands = [];

      if(this.router.url.indexOf("/students/") === -1){
        commands = ['students', getStudent(actionable).id];
      }

      commands.push('exams');
      commands.push(getExamId(actionable));

      this.router.navigate(commands, { relativeTo: this.route });
    }).bind(this);

    this.actions.push(responsesAction);
    return this;
  }

  /**
   * Adds an action item which shows resources
   *
   * @param getAssessmentName lambda which accesses the assessment name.
   * @returns {MenuActionBuilder}
   */
  withShowResources(getAssessmentName: (name: any) => string){
    let resourcesLabel: string = this.translateService.instant('labels.menus.resources');
    let resourcesAction: PopupMenuAction = new PopupMenuAction();

    resourcesAction.displayName = (() => resourcesLabel);
    resourcesAction.perform = ((actionable) => {
      console.log(`Show Resources: ${getAssessmentName(actionable)}`)
    }).bind(this);

    this.actions.push(resourcesAction);
    return this;
  }

  build(): PopupMenuAction[] {
    return this.actions;
  }
}
