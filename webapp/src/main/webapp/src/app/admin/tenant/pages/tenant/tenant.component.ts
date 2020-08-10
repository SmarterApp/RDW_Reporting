import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  finalize,
  map,
  mapTo,
  mergeMap,
  publishReplay,
  refCount,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
  throttleTime
} from 'rxjs/operators';
import { TenantService } from '../../service/tenant.service';
import { DataSet, TenantConfiguration } from '../../model/tenant-configuration';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { UserService } from '../../../../shared/security/service/user.service';
import { LanguageStore } from '../../../../shared/i18n/language.store';
import { NotificationService } from '../../../../shared/notification/notification.service';
import { RdwTranslateLoader } from '../../../../shared/i18n/rdw-translate-loader';
import { of } from 'rxjs/internal/observable/of';
import {
  FormMode,
  FormState
} from '../../component/tenant-form/tenant-form.component';
import { TenantType } from '../../model/tenant-type';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { defaultTenant } from '../../model/tenants';
import { flatten } from '../../../../shared/support/support';
import { TenantModalService } from '../../service/tenant-modal.service';
import { ordering } from '@kourge/ordering';
import { byString } from '@kourge/ordering/comparator';
import { State } from '../../model/state';
import { StateOptionsService } from '../../service/state-options.service';
import { KeepAliveService } from '../../../../shared/security/service/keep-alive.service';

const keepAliveThrottleTime = 1000 * 60; // 1 minute

const validTenantStatus = status =>
  ['ACTIVE', 'UPDATE_FAILED'].includes(status);

const byLabel = ordering(byString).on<TenantConfiguration | DataSet>(
  ({ label }) => label
).compare;

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.less']
})
export class TenantComponent implements OnInit, OnDestroy {
  type$: Observable<TenantType>;
  mode$: Observable<FormMode>;
  tenant$: Observable<TenantConfiguration>;
  tenants$: Observable<TenantConfiguration[]>;
  dataSets$: Observable<DataSet[]>;
  configurationDefaults$: Observable<any>;
  localizationDefaults$: Observable<any>;
  writable$: Observable<boolean>;
  states$: Observable<State[]>;
  tenantKeyAvailable: (value: string) => Observable<boolean>;
  tenantIdAvailable: (value: string) => Observable<boolean>;
  initialized$: Observable<boolean>;
  initializationError$: Observable<any>;
  state$: Subject<FormState> = new BehaviorSubject(undefined);
  destroyed$: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: TenantService,
    private userService: UserService,
    private stateOptionService: StateOptionsService,
    private languageStore: LanguageStore,
    private modalService: TenantModalService,
    private notificationService: NotificationService,
    private translationLoader: RdwTranslateLoader,
    private keepAliveService: KeepAliveService
  ) {
    const sandboxDataSets$ = this.service.getSandboxDataSets().pipe(
      map(values => values.slice().sort(byLabel)),
      share()
    );
    const tenants$ = this.service.getAll('TENANT').pipe(
      map(values =>
        values
          .slice()
          .filter(({ status }) => validTenantStatus(status))
          .sort(byLabel)
      ),
      share()
    );

    this.tenantKeyAvailable = (value: string) =>
      this.service
        .exists((value || '').toUpperCase())
        .pipe(map(exists => !exists));

    this.tenantIdAvailable = (value: string) =>
      this.service
        .existsId((value || '').toUpperCase())
        .pipe(map(exists => !exists));

    this.type$ = this.route.data.pipe(map(({ type }) => type));
    this.mode$ = this.route.data.pipe(map(({ mode }) => mode));

    this.tenants$ = this.type$.pipe(
      mergeMap(type => (type === 'SANDBOX' ? tenants$ : of([]))),
      publishReplay(),
      refCount()
    );

    this.dataSets$ = this.type$.pipe(
      mergeMap(type => (type === 'SANDBOX' ? sandboxDataSets$ : of([]))),
      publishReplay(),
      refCount()
    );

    this.configurationDefaults$ = this.type$.pipe(
      mergeMap(type => this.service.getDefaultConfigurationProperties(type)),
      publishReplay(),
      refCount()
    );

    // If editing an existing tenant then load the localizations and details
    // (if not, this is the create path so get default localizations and tenant)

    this.localizationDefaults$ = this.route.params.pipe(
      mergeMap(({ id }) =>
        (id != null
          ? this.translationLoader.getTenantTranslation(
              this.languageStore.currentLanguage,
              id
            )
          : this.translationLoader.getTranslation(
              this.languageStore.currentLanguage
            )
        ).pipe(map(translations => flatten(translations)))
      ),
      publishReplay(),
      refCount()
    );

    this.tenant$ = this.route.params.pipe(
      mergeMap(({ id }) =>
        id != null
          ? this.service.get(id)
          : combineLatest(this.type$, this.tenants$, this.dataSets$).pipe(
              takeUntil(this.destroyed$),
              map(([type, [firstTenant], [firstDataSet]]) =>
                defaultTenant(type, firstTenant, firstDataSet)
              )
            )
      ),
      publishReplay(),
      refCount()
    );

    this.writable$ = this.userService
      .getUser()
      .pipe(map(({ permissions }) => permissions.includes('TENANT_WRITE')));

    this.states$ = this.stateOptionService.getStates();

    this.initialized$ = combineLatest(
      this.type$,
      this.mode$,
      this.tenants$,
      this.dataSets$,
      this.configurationDefaults$,
      this.localizationDefaults$,
      this.tenant$,
      this.states$
    ).pipe(
      takeUntil(this.destroyed$),
      mapTo(true)
    );

    this.initializationError$ = this.initialized$.pipe(
      catchError(error => of(error))
    );
  }

  ngOnInit(): void {
    combineLatest(
      // give these an artificial starting value so the stream
      // is "filled" when either of these events is triggered
      fromEvent(document, 'click').pipe(startWith(null)),
      fromEvent(document, 'keydown').pipe(startWith(null))
    )
      .pipe(
        takeUntil(this.destroyed$),
        throttleTime(keepAliveThrottleTime),
        switchMap(() => this.keepAliveService.extendSession())
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onCreate(value: TenantConfiguration): void {
    this.submit('create', value);
  }

  onUpdate(value: TenantConfiguration): void {
    this.submit('update', value);
  }

  onDelete(tenant: TenantConfiguration): void {
    this.modalService
      .openDeleteConfirmationModal(tenant)
      .pipe(
        tap(() => {
          this.state$.next('deleting');
        }),
        switchMap(() =>
          this.service.delete(tenant.code).pipe(
            finalize(() => {
              this.state$.next(undefined);
            })
          )
        )
      )
      .subscribe(
        () => this.navigateToListPage(tenant.type),
        () => {
          this.notificationService.error({
            id: `tenant.delete.error.${tenant.type}`
          });
        }
      );
  }

  private submit(mode: FormMode, value: TenantConfiguration): void {
    this.state$.next(mode === 'create' ? 'creating' : 'saving');

    const state$ =
      value.type === 'SANDBOX'
        ? this.service
            .get(value.parentTenantCode)
            .pipe(map(tenant => tenant.configurations['reporting.state']))
        : of(undefined);

    state$.subscribe(state => {
      if (state != null) {
        value.configurations['reporting.state'] = state;
      }

      const observable =
        mode === 'create'
          ? this.service.create(value)
          : this.service.update(value);

      observable
        .pipe(
          finalize(() => {
            this.state$.next(undefined);
          })
        )
        .subscribe(
          () => this.navigateToListPage(value.type),
          error => {
            try {
              this.notificationService.error({ id: error.json().message });
            } catch (exception) {
              this.notificationService.error({
                id: `tenant.${mode}.error.${value.type}`
              });
            }
          }
        );
    });
  }

  private navigateToListPage(tenantType: TenantType): void {
    this.router.navigateByUrl(
      tenantType === 'TENANT' ? '/tenants' : '/sandboxes'
    );
  }
}
