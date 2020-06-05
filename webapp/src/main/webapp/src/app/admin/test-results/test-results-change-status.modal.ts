import { BsModalRef } from 'ngx-bootstrap';
import { TestResultsService } from './service/test-results.service';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { TestResultFilters } from './model/test-result-filters';

@Component({
  selector: 'test-results-change-status.modal',
  templateUrl: 'test-results-change-status.modal.html'
})
export class TestResultsChangeStatusModal implements OnInit {
  private _subscription: Subscription;
  selectedFilters: TestResultFilters;
  statusOptions: string[];
  selectedStatus: string;

  constructor(
    private modal: BsModalRef,
    private service: TestResultsService,
    private router: Router
  ) {
    this._subscription = router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe(() => {
        this.cancel();
      });
  }

  private cancel() {
    this.modal.hide();
  }

  ngOnInit(): void {
    this.selectedFilters = this.service.getTestResultFilterDefaults();
    this.statusOptions = this.service.getTestResultsStatusOptions();
  }

  changeTestResults(): void {
    this.service.changeTestResults(this.selectedFilters, this.selectedStatus);
    this.modal.hide();
  }

  onChangeStatusFilter(status: any): void {
    this.selectedStatus = status;
  }
}