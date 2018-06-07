import { Injectable } from "@angular/core";
import { Report } from "./report.model";
import { ReportService } from "./report.service";
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
              private router: Router) {
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
  public performAction(action: ReportAction): void {
    if (action.disabled) {
      return;
    }

    if (action.type == ActionType.Download) {
      this.performDownload(action);
    }
    if (action.type == ActionType.Navigate) {
      this.performNavigate(action);
    }
  }

  private performDownload(action: ReportAction): void {
    this.reportService.downloadReportContent(action.value);
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
  readonly popoverKey?: string;
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
        labelKey: 'report-action.download-report'
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
    return report.reportType.startsWith(AggregateReportType)
      && !report.processing;
  }

  public getActions(report: Report): ReportAction[] {
    const disableViewAndDownload: boolean = !report.completed && !report.processing;
    const embargoed: boolean = report.metadata.createdWhileDataEmbargoed === "true";
    return [
      {
        type: ActionType.Navigate,
        value: `/aggregate-reports/${report.id}`,
        labelKey: 'report-action.view-report',
        disabled: disableViewAndDownload
      },
      {
        type: ActionType.Navigate,
        value: `/aggregate-reports?src=${report.id}`,
        labelKey: 'report-action.view-query'
      },
      {
        type: ActionType.Download,
        value: report.id,
        labelKey: 'report-action.download-report',
        disabled: disableViewAndDownload || embargoed,
        popoverKey: embargoed ? 'report-action.embargoed' : undefined
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


