import { Injectable } from "@angular/core";
import { Report } from "./report.model";
import { ReportService } from "./report.service";
import { Download } from "../shared/data/download.model";
import { Router } from "@angular/router";
import { saveAs } from "file-saver";
import { Observable } from "rxjs/Observable";
import { NotificationService } from "../shared/notification/notification.service";
import "rxjs/add/observable/empty";

export const AggregateReportType: string = "AggregateReportRequest";

/**
 * This service is responsible for providing the actions available for a given
 * report.
 */
@Injectable()
export class ReportActionService {

  private actionProviders: ActionProvider[] = [
    new AggregateReportActionProvider(),
    new DefaultActionProvider()
  ];

  constructor(private reportService: ReportService,
              private router: Router,
              private notificationService: NotificationService) {
  }

  /**
   * Get the list of actions that can be performed on the given report.
   *
   * @param {Report} report     A report
   * @returns {ReportAction[]}  The actions available for the report
   */
  public getActions(report: Report): ReportAction[] {
    return this.actionProviders
      .find(provider => provider.supports(report))
      .getActions(report);
  }

  /**
   * Perform the given action.
   *
   * @param {ReportAction} action An action
   */
  public performAction(action: ReportAction): Observable<any> {
    switch (action.type) {
      case ActionType.Download:
        return this.performDownload(action);
      case ActionType.Navigate:
        this.performNavigate(action);
        return Observable.empty();
    }
  }

  /**
   * Test
   * @param {ReportAction} action
   * @returns {Observable<any>}
   */
  private performDownload(action: ReportAction): Observable<any> {
    const observable: Observable<any> = this.reportService.getReportContent(action.value);
    observable
      .subscribe(
        (download: Download) => {
          saveAs(download.content, download.name);
        },
        (error) => {
          this.notificationService.error({ id: 'labels.reports.messages.download-failed' });
        });
    return observable;
  }

  private performNavigate(action: ReportAction): void {
    this.router.navigateByUrl(action.value);
  }
}

/**
 * Instances of this interface contain all information required
 * to perform a user action on a report.
 */
export interface ReportAction {
  readonly type: ActionType;
  readonly value: any;
  readonly icon?: string;
  readonly labelKey?: string;
  readonly disabled?: boolean;
}

/**
 * The available action types.
 */
export enum ActionType {
  Navigate,
  Download
}

/**
 * This default action provider is capable of supporting all Report instances.
 * It will return:
 *   no actions for an incomplete report,
 *   a download action for a complete report,
 *   a regenerate action for a failed report
 */
class DefaultActionProvider implements ActionProvider {

  public supports(report: Report) {
    return true;
  }

  public getActions(report: Report): ReportAction[] {
    if (!report.completed) {
      return [];
    }
    return [
      {
        type: ActionType.Download,
        value: report.id,
        labelKey: 'labels.reports.report-actions.download-report'
      }
    ];
  }
}

/**
 * This action provider only supports completed aggregate reports.
 * It returns a:
 *  view report action,
 *  view query action,
 *  download report data action
 */
class AggregateReportActionProvider extends DefaultActionProvider {

  public supports(report: Report): boolean {
    return report.reportType === AggregateReportType
      && !report.processing;
  }

  public getActions(report: Report): ReportAction[] {
    const disableViewAndDownload = !report.completed && !report.processing;
    return [
      {
        type: ActionType.Navigate,
        value: `/aggregate-reports/${report.id}`,
        labelKey: 'labels.reports.report-actions.view-report',
        disabled: disableViewAndDownload
      },
      {
        type: ActionType.Navigate,
        value: `/aggregate-reports?src=${report.id}`,
        labelKey: 'labels.reports.report-actions.view-query'
      },
      {
        type: ActionType.Download,
        value: report.id,
        labelKey: 'labels.reports.report-actions.download-report',
        disabled: disableViewAndDownload
      }
    ];
  }

}

/**
 * Implementations of this interface are responsible for optionally
 * supporting a report instance.  If supported, the implementation is
 * responsible for providing all actions that can be performed on
 * the given report.
 */
interface ActionProvider {

  supports(report: Report): boolean;

  getActions(report: Report): ReportAction[];

}


