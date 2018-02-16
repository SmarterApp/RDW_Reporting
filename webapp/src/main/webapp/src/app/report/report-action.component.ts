import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ReportAction, ReportActionService } from "./report-action.service";
import { PopupMenuAction } from "../shared/menu/popup-menu-action.model";
import { Report } from "./report.model";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";
import { Download } from "../shared/data/download.model";
import { saveAs } from "file-saver";
import { SpinnerModal } from "../shared/loading/spinner.modal";
import { NotificationService } from "../shared/notification/notification.service";
import 'rxjs/add/operator/finally';

/**
 * Responsible for providing a UI displaying and performing an action
 * on a Report.
 */
@Component({
  selector: 'report-action',
  templateUrl: './report-action.component.html'
})
export class ReportActionComponent implements OnInit {


  @ViewChild('spinnerModal')
  spinnerModal: SpinnerModal;

  @Input()
  public report: Report;

  public reportActions: ReportAction[] = [];

  public get menuActions(): PopupMenuAction[] {
    return this.reportActions
      .map(reportAction => this.toMenuAction(reportAction));
  }

  constructor(private actionService: ReportActionService,
              private translateService: TranslateService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.reportActions = this.actionService.getActions(this.report);
  }

  performAction(reportAction: ReportAction): void {
    this.spinnerModal.loading = true;
    const observable: Observable<Download> | void = this.actionService.performAction(reportAction);
    if (observable) {
      observable.finally(() => {
        this.spinnerModal.loading = false;
      }).subscribe(
        (download: Download) => {
          saveAs(download.content, download.name);
        },
        () => {
          this.notificationService.error({ id: 'labels.reports.messages.download-failed' });
        },
      );
    }
  }

  private toMenuAction(reportAction: ReportAction): PopupMenuAction {
    const menuAction: PopupMenuAction = new PopupMenuAction();
    menuAction.perform = () => {
      this.actionService.performAction(reportAction);
    };
    menuAction.displayName = () => {
      return this.translateService.instant(reportAction.labelKey);
    };
    menuAction.isDisabled = () => {
      return reportAction.disabled;
    };
    return menuAction;
  }
}
