import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Student } from "../../student/model/student.model";
import { InstructionalResource } from "../model/instructional-resources.model";
import { Observable } from "rxjs/Observable";
import { PopupMenuAction } from "../../shared/menu/popup-menu-action.model";
import { map } from 'rxjs/operators';

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
      return this.translateService.instant('common.menus.test-history', getStudent(actionable));
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
      return this.translateService.instant('common.menus.responses', getStudent(actionable));
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
        ? this.translateService.instant('assessment-results.no-results-by-item')
        : '';
    });

    this.actions.push(responsesAction);
    return this;
  }

  /**
   * Adds an action item which shows instructional resources.
   *
   * @param loadResources lambda which fetches the instructional resources for a row item
   * @returns {MenuActionBuilder}
   */
  withShowResources(loadResources: (actionable: any) => Observable<InstructionalResource[]>) {
    let resourcesLabel: string = this.translateService.instant('common.menus.resources');

    let resourcesAction: PopupMenuAction = new PopupMenuAction();
    resourcesAction.getSubActions = ((actionable) => {
      return loadResources(actionable)
        .pipe(
          map((resources: InstructionalResource[]) => {
            if (!resources.length) {
              let noResourcesAction = new PopupMenuAction();
              noResourcesAction.isDisabled = () => true;
              noResourcesAction.displayName = () => this.translateService.instant('common.results.assessment.no-instruct-found');
              return [noResourcesAction];
            }
            return this.asInstructionalResourceActions.call(this, resources);
          })
        );
    });

    resourcesAction.displayName = (() => resourcesLabel);
    resourcesAction.perform = (() => {});

    this.actions.push(resourcesAction);
    return this;
  }

  withStudentReport(getAssessmentType: (x: any) => string, getStudent: (x: any) => Student, submitReport: (x: any) => void): MenuActionBuilder {
    const action: PopupMenuAction = new PopupMenuAction();

    action.displayName = ((actionable: any) => {
      return this.translateService.instant(`common.menus.student-report.${getAssessmentType(actionable)}`, getStudent(actionable));
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

  private asInstructionalResourceActions(resources: InstructionalResource[]): PopupMenuAction[] {
    return resources.map(this.asInstructionalResourceAction.bind(this));
  }

  private asInstructionalResourceAction(resource: InstructionalResource): PopupMenuAction {
    let action: PopupMenuAction = new PopupMenuAction();
    action.displayName = (() => {
      return this.translateService.instant(`common.instructional-resources.link.${resource.organizationLevel}`, resource);
    });
    action.perform = (() => {
      window.open(resource.url, "_blank");
    });

    return action;
  }
}
