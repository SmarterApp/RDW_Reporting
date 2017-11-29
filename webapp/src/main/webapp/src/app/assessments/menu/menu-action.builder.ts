import { Injectable } from "@angular/core";
import { PopupMenuAction } from "./popup-menu-action.model";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Student } from "../../student/model/student.model";
import { AssessmentType } from "../../shared/enum/assessment-type.enum";
import { Utils } from "@sbac/rdw-reporting-common-ngx";

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
  private actions: PopupMenuAction[] = [];

  constructor(private translateService: TranslateService,
              private route: ActivatedRoute,
              private router: Router) {
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
  withStudentHistory(getStudent: (s: any) => Student): MenuActionBuilder {
    let action: PopupMenuAction = new PopupMenuAction();

    action.displayName = ((actionable: any) => {
      return this.translateService.instant('labels.menus.test-history', getStudent(actionable));
    }).bind(this);
    action.perform = ((actionable: any) => {
      this.router.navigate([ 'students', getStudent(actionable).id ], { relativeTo: this.route });
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
  withResponses(getExamId: (x:any) => number, getStudent: (x:any) => Student, hasItemLevelData: (x:any) => boolean): MenuActionBuilder {
    let responsesAction: PopupMenuAction = new PopupMenuAction();

    responsesAction.displayName = ((actionable: any) => {
      return this.translateService.instant('labels.menus.responses', getStudent(actionable));
    }).bind(this);

    responsesAction.perform = ((actionable: any) => {
      let commands = [];

      if (this.router.url.indexOf("/students/") === -1) {
        commands = [ 'students', getStudent(actionable).id ];
      }

      commands.push('exams');
      commands.push(getExamId(actionable));

      this.router.navigate(commands, { relativeTo: this.route });
    }).bind(this);

    responsesAction.isDisabled = ((actionable) => {
      return !hasItemLevelData(actionable);
    }).bind(this);

    responsesAction.tooltip = ((actionable) => {
      return responsesAction.isDisabled(actionable)
        ? this.translateService.instant('messages.no-results-by-item')
        : '';
    });

    this.actions.push(responsesAction);
    return this;
  }

  /**
   * Adds an action item which shows resources.  If the resource url is null
   * or undefined then the action item will be disabled with a tooltip.
   * TODO: This should display a 2nd-level/popup menu containing assessment/school resources on click/hover
   *
   * @param getResourceUrl lambda which accesses the assessment resource url.
   * @returns {MenuActionBuilder}
   */
  withShowResources(getResourceUrl: (actionable: any) => string) {
    let resourcesLabel: string = this.translateService.instant('labels.menus.resources');
    let resourcesAction: PopupMenuAction = new PopupMenuAction();

    resourcesAction.isDisabled = ((actionable) => {
      return Utils.isNullOrUndefined(getResourceUrl(actionable));
    });

    resourcesAction.tooltip = ((actionable) => {
      return resourcesAction.isDisabled(actionable)
        ? this.translateService.instant('labels.menus.resources-disabled-message')
        : '';
    });

    resourcesAction.displayName = (() => resourcesLabel);
    resourcesAction.perform = ((actionable) => {
      window.open(getResourceUrl(actionable));
    }).bind(this);

    this.actions.push(resourcesAction);
    return this;
  }

  withStudentReport(getAssessmentType: (x:any) => AssessmentType, getStudent: (x:any) => Student, submitReport: (x:any) => void): MenuActionBuilder {
    let action: PopupMenuAction = new PopupMenuAction();

    action.displayName = ((actionable: any) => {
      let assessmentType = getAssessmentType(actionable);
      return this.translateService.instant('labels.menus.student-report.' + AssessmentType[assessmentType].toLowerCase(), getStudent(actionable));
    }).bind(this);
    action.perform = ((actionable: any) => {
      submitReport(actionable);
    }).bind(this);

    this.actions.push(action);
    return this;
  }

  build(): PopupMenuAction[] {
    return this.actions;
  }

}
