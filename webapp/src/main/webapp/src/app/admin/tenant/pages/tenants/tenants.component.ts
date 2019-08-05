import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  timer
} from 'rxjs';
import { TenantService } from '../../service/tenant.service';
import { TenantConfiguration } from '../../model/tenant-configuration';
import { filter, flatMap, map, takeUntil } from 'rxjs/operators';
import { TenantType } from '../../model/tenant-type';
import { tap } from 'rxjs/internal/operators/tap';
import { ordering } from '@kourge/ordering';
import { byString } from '@kourge/ordering/comparator';
import { TenantModalService } from '../../service/tenant-modal.service';
import { TenantsStore } from '../../state/tenants.store';
import { NotificationService } from '../../../../shared/notification/notification.service';

const pollingInterval = 1000 * 15; // backend polls at 30s

const byKey = ordering(byString).on(({ code: key }) => key).compare;

@Component({
  selector: 'tenants',
  templateUrl: './tenants.component.html'
})
export class TenantsComponent implements OnDestroy {
  tenantType$: Observable<TenantType>;
  tenants$: Observable<TenantConfiguration[]>;
  destroyed$: Subject<void> = new Subject<void>();
  polling$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: TenantService,
    private store: TenantsStore,
    private modalService: TenantModalService,
    private notificationService: NotificationService
  ) {
    this.tenantType$ = this.route.data.pipe(map(({ type }) => type));

    // reset state so there is no flash of sandboxes on the tenants page or vice versa
    this.store.setState([]);

    this.tenants$ = this.store.getState();

    // TODO we should really only ping for status updates - not the entire tenant data
    combineLatest(this.tenantType$, timer(0, pollingInterval))
      .pipe(
        takeUntil(this.destroyed$),
        // don't query the server unless the previous request is complete
        filter(() => !this.polling$.value),
        tap(() => {
          this.polling$.next(true);
        }),
        flatMap(([type]) =>
          this.service.getAll(type).pipe(
            map(tenants => tenants.slice().sort(byKey)),
            // would like a less side-effecty way to do this but it works at least
            tap(tenants => {
              this.polling$.next(false);
            })
          )
        )
      )
      .subscribe(tenants => {
        this.store.setState(tenants);
      });
  }

  onTenantClick(tenant: TenantConfiguration): void {
    this.router.navigate(['.', tenant.code], {
      relativeTo: this.route
    });
  }

  onTenantDeleteButtonClick(tenant: TenantConfiguration): void {
    this.modalService.openDeleteConfirmationModal(tenant).subscribe(() => {
      // Find and replace deleted tenant status with deleting status
      this.store.setState(
        this.store.state.map(t =>
          t.code === tenant.code
            ? <TenantConfiguration>{
                ...t,
                status: 'DELETE_STARTED'
              }
            : t
        )
      );

      this.service.delete(tenant.code).subscribe(
        () => {
          // we already updated the status
        },
        error => {
          this.notificationService.error({
            id: `tenant.delete.error.${tenant.type}`
          });
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
