import { Injectable } from "@angular/core";
import { Report } from "./report.model";
import { saveAs } from "file-saver";
import { NotificationService } from "../shared/notification/notification.service";
import { ReportService } from "./report.service";
import { Download } from "../shared/data/download.model";
import { Router } from "@angular/router";

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
              private notificationService: NotificationService) {}

  /**
   * Get the list of actions that can be performed on the given report.
   *
   * @param {Report} report     A report
   * @returns {ReportAction[]}  The actions available for the report
   */
  public getActions(report: Report): ReportAction[] {
    return this.actionProviders
      .find(provider => provider.accept(report))
      .getActions(report);
  }

  /**
   * Perform the given action.
   *
   * @param {ReportAction} action An action
   */
  public performAction(action: ReportAction): void {
    switch (action.type) {
      case ActionType.Download:
        this.performDownload(action);
        return;
      case ActionType.Navigate:
        this.performNavigate(action);
        return;
    }
  }

  private performDownload(action: ReportAction): void {
    this.reportService.getExamReport(action.value)
      .subscribe(
        (download: Download) => {
          saveAs(download.content, download.name);
        },
        () => {
          this.notificationService.error({ id: 'labels.reports.messages.download-failed' });
        }
      );
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
}

/**
 * The available action types.
 */
export enum ActionType {
  Navigate,
  Download
}

/**
 * This default action provider is capable of accepting all Report instances.
 * It will return:
 *   no actions for an incomplete report,
 *   a download action for a complete report,
 *   a regenerate action for a failed report
 */
class DefaultActionProvider implements ActionProvider {

  public accept(report: Report) {
    return true;
  }

  public getActions(report: Report): ReportAction[] {
    if (!report.completed) {
      return [];
    }

    return [{
      icon: "fa-cloud-download",
      type: ActionType.Download,
      value: report.id
    }];
  }
}

/**
 * This action provider only accepts completed aggregate reports.
 * It returns a:
 *  view report action,
 *  view query action,
 *  download report data action
 */
class AggregateReportActionProvider extends DefaultActionProvider {

  public accept(report: Report): boolean {
    return report.reportType === AggregateReportType &&
      report.completed;
  }

  public getActions(report: Report): ReportAction[] {
    return [{
      icon: "fa-cloud-download",
      type: ActionType.Navigate,
      value: `/aggregate-reports/${report.id}`,
      labelKey: "labels.reports.report-actions.view-report"
    }, {
      icon: "fa-cloud-download",
      type: ActionType.Navigate,
      value: `/aggregate-reports?src=${report.id}`,
      labelKey: "labels.reports.report-actions.view-query"
    }, {
      icon: "fa-cloud-download",
      type: ActionType.Download,
      value: report.id,
      labelKey: "labels.reports.report-actions.download-report"
    }]
  }
}

/**
 * Implementations of this interface are responsible for optionally
 * accepting a report instance.  If accepted, the implementation is
 * responsible for providing all actions that can be performed on
 * the given report.
 */
interface ActionProvider {
  accept(report: Report): boolean;

  getActions(report: Report): ReportAction[];
}


