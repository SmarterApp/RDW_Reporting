import { BsModalRef } from 'ngx-bootstrap';
import { TestResultsAvailabilityService } from './service/test-results-availability.service';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { TestResultAvailabilityFilters } from './model/test-result-availability-filters';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'test-results-change-status-modal',
  templateUrl: 'test-results-availability-change-status.modal.html'
})
// tslint:disable-next-line:component-class-suffix
export class TestResultsAvailabilityChangeStatusModal implements OnInit {
  private _subscription: Subscription;
  public changeStatusEvent: EventEmitter<any> = new EventEmitter();

  // The following are set by initial state on show modal
  sandboxUser: boolean;
  selectedFilters: TestResultAvailabilityFilters;
  statusOptions: { label: string; value: string }[];
  selectedStatus: { label: string; value: string };

  showSandboxAlert = false;

  constructor(
    private modal: BsModalRef,
    private service: TestResultsAvailabilityService,
    private router: Router,
    private translate: TranslateService
  ) {
    this._subscription = router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe(() => {
        this.cancel();
      });
  }

  ngOnInit(): void {}

  cancel() {
    this.modal.hide();
  }

  changeTestResults(): void {
    if (this.sandboxUser) {
      // is a sandbox, do not allow and actual test results status changes
      // keep modal up to display message to user
      this.showSandboxAlert = true;
    } else {
      this.service
        .changeTestResults(this.selectedFilters, this.selectedStatus)
        .subscribe(
          () => {
            this.triggerEventStatus(true, this.getSuccessfulChangeMessage());
            this.modal.hide();
          },
          err => {
            this.triggerEventStatus(false, this.getFailedChangeMessage(err));
            this.modal.hide();
          }
        );
    }
  }

  // build up message that expects to go between msgs test-results-availability-change-status.successful-change-1
  // and test-results-availability-change-status.successful-change-3
  private getSuccessfulChangeMessage(): string {
    return (
      '"' +
      `${this.translate.instant(this.selectedStatus.label)}` +
      '"' +
      `${this.translate.instant(
        'test-results-availability-change-status.successful-change-2'
      )}` +
      `${this.translate.instant(
        'test-results-availability.filter-school-year'
      )}: ` +
      `${this.translate.instant(this.selectedFilters.schoolYear.label)}` +
      ', ' +
      `${this.translate.instant(
        'test-results-availability.filter-subject'
      )}: ` +
      `${this.translate.instant(this.selectedFilters.subject.label)}` +
      ', ' +
      `${this.translate.instant(
        'test-results-availability.filter-district'
      )}: ` +
      `${this.translate.instant(this.selectedFilters.district.label)}` +
      ', ' +
      `${this.translate.instant(
        'test-results-availability.filter-report-type'
      )}: ` +
      `${this.translate.instant(this.selectedFilters.reportType.label)}` +
      ', ' +
      `${this.translate.instant('test-results-availability.filter-status')}: ` +
      `${this.translate.instant(this.selectedFilters.status.label)}` +
      ').'
    );
  }

  private getFailedChangeMessage(err: any): string {
    return (
      this.translate.instant(
        'test-results-availability-change-status.error-changing-results'
      ) +
      ': ' +
      err._body
    );
  }

  private triggerEventStatus(successful: boolean, message: string) {
    this.changeStatusEvent.emit({
      // return the selected filters and status of the successful change
      successful: successful,
      message: message,
      status: this.selectedStatus,
      res: successful ? 202 : 400
    });
  }

  onChangeStatusFilter(status: any): void {
    this.selectedStatus = status;
  }
}
