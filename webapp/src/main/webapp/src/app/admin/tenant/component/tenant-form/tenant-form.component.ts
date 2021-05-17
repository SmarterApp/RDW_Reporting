import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { DataSet, TenantConfiguration } from '../../model/tenant-configuration';
import { showErrors, validate } from '../../../../shared/form/forms';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
  finalize,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { toTreeNodes } from '../property-override-tree-table/property-override-tree-table.component';
import {
  rightDifference,
  unflatten,
  valued
} from '../../../../shared/support/support';
import { TreeNode } from 'primeng/api';
import { keyBy } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { byString, Comparator, join } from '@kourge/ordering/comparator';
import { TenantService } from '../../service/tenant.service';
import { State } from '../../model/state';
import { ordering } from '@kourge/ordering';
import { Property } from '../../model/property';
import { configurationFormFields } from '../../model/configuration-forms';
import { stringDataType } from '../../model/data-types';
import { propertyForm } from '../../model/property-forms';
import {
  getFirstInvalidFormFieldName,
  propertiesProvider,
  tenantForm,
  topLevelConfigurationFormFieldNames
} from './tenant-forms';
import {
  toConfigurationProperties,
  toLocalizationProperties
} from '../../model/properties';

export type FormMode = 'create' | 'update';
export type FormState = 'creating' | 'saving' | 'deleting';

function stateToTenant(
  initialValue: TenantConfiguration,
  configurationDefaults: any,
  localizationDefaults: any,
  formValue: any,
  mode: FormMode
): TenantConfiguration {
  const { code: tenantCode, id: tenantId, type } = initialValue;
  const {
    id,
    key: code,
    label,
    description,
    tenant,
    dataSet,
    configurations = {},
    localizations = {}
  } = formValue;

  const createMode = mode === 'create';
  const parentTenantCode = (tenant || <any>{}).code;
  const computedConfigurations = valued(
    rightDifference(configurationDefaults, configurations)
  );
  const computedLocalizations = valued(
    rightDifference(localizationDefaults, localizations)
  );

  return {
    type,
    code: createMode ? code : tenantCode,
    id: createMode ? id : tenantId,
    label,
    description,
    parentTenantCode,
    dataSet,
    configurations: computedConfigurations,
    localizations: computedLocalizations
  };
}

// dont fill the send report archives
const archivePathPrefixPattern = /^archive\.pathPrefix$/;
const datasourcePattern = /^datasources\.(\w+)\..+$/;
const defaultDatabaseNameProviderByDatasource = {
  migrate: key => `migrate_olap_${key}`,
  olap: key => `reporting_${key}`, // the special case
  reporting: key => `reporting_${key}`,
  warehouse: key => `warehouse_${key}`
};

// TODO only issue with this is this doesn't change the defaultValue so the values
// get marked as modified and using FormControl.dirty isn't enough because it doesn't
// detect that the value is the same as it started
// apply default passwords for sandboxes based on key
function setDefaultsUsingTenantKey(
  formGroup: FormGroup,
  inputKey: string
): void {
  const tenantKey = (inputKey || '').toLowerCase();
  const defaultUsername = `rdw_${tenantKey}`;

  Object.entries(formGroup.controls)
    .filter(([key]) => archivePathPrefixPattern.test(key))
    .forEach(([key]) => {
      patch(formGroup.controls[key], tenantKey);
    });

  Object.entries(formGroup.controls)
    // find datasource controls
    .filter(([key]) => datasourcePattern.test(key))
    // extract the datasource names
    .map(([key]) => datasourcePattern.exec(key)[1])
    // reduce to a set of the names
    .reduce((sources, source) => {
      if (!sources.includes(source)) {
        sources.push(source);
      }
      return sources;
    }, [])
    // for every datasource name apply defaults
    .forEach(source => {
      patch(
        formGroup.controls[`datasources.${source}.username`],
        defaultUsername
      );

      const sourceName = source.replace(/_r(o|w)$/, '');
      const defaultDatabaseName = defaultDatabaseNameProviderByDatasource[
        sourceName
      ](tenantKey);

      [
        formGroup.controls[`datasources.${source}.urlParts.database`],
        formGroup.controls[`datasources.${source}.schemaSearchPath`]
      ].forEach(control => {
        patch(control, defaultDatabaseName);
      });
    });
}

function setDefaultState(
  control: AbstractControl,
  searchCode: string,
  states: State[]
): void {
  const state = states.find(
    ({ code }) => code.toLowerCase() === searchCode.toLowerCase()
  );
  if (state != null) {
    patch(control, state);
  }
}

function patch(control: AbstractControl, value: any): void {
  if (control != null && control.pristine) {
    control.patchValue(value);
  }
}

@Component({
  selector: 'app-tenant-form',
  templateUrl: './tenant-form.component.html',
  styleUrls: ['./tenant-form.component.less']
})
export class TenantFormComponent implements OnChanges, OnDestroy {
  readonly showErrors = showErrors;

  @Input()
  tenantKeyAvailable: (value: string) => Observable<boolean>;

  @Input()
  tenantIdAvailable: (value: string) => Observable<boolean>;

  @Input()
  mode: FormMode;

  @Input()
  value: TenantConfiguration;

  @Input()
  tenants: TenantConfiguration[];

  @Input()
  dataSets: DataSet[];

  @Input()
  configurationDefaults: any;

  @Input()
  localizationDefaults: any;

  @Input()
  writable: boolean;

  @Input()
  states: State[];

  @Output()
  create: EventEmitter<TenantConfiguration> = new EventEmitter();

  @Output()
  update: EventEmitter<TenantConfiguration> = new EventEmitter();

  @Output()
  delete: EventEmitter<TenantConfiguration> = new EventEmitter();

  @Input()
  set configurationOpen(value: boolean) {
    this.configurationsOpen$.next(value);
  }

  @Input()
  localizationOpen: boolean = false;

  @Input()
  requiredConfiguration: boolean;

  @Input()
  state: FormState;

  configurationControlsFormGroup: FormGroup = new FormGroup({
    search: new FormControl(''),
    required: new FormControl(false),
    modified: new FormControl(false)
  });
  configurations$: Observable<TreeNode[]>;
  configurationPropertyComparator: Comparator<Property>;

  localizationControlsFormGroup: FormGroup = new FormGroup({
    search: new FormControl(''),
    modified: new FormControl(false)
  });
  localizations$: Observable<Property[]>;

  formGroup: FormGroup;
  configurationsOpen$: Subject<boolean> = new BehaviorSubject(false);
  submitted$: Subject<boolean> = new BehaviorSubject(false);
  private destroyed$: Subject<void> = new Subject();
  private loadingTenant$: Subject<boolean> = new BehaviorSubject(false);

  private invalidConfigurationIntervalDuration: number = 250;
  private invalidConfigurationInterval: number;

  constructor(
    private translateService: TranslateService,
    private tenantService: TenantService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { state } = changes;

    // do not re-initialize when state changes
    // this also shows that the form controls should lie outside of this form
    if (state != null && Object.keys(changes).length === 1) {
      return;
    }

    const {
      mode,
      value,
      tenants,
      dataSets,
      configurationDefaults,
      localizationDefaults,
      tenantKeyAvailable,
      tenantIdAvailable,
      requiredConfiguration,
      states
    } = this;

    if (
      value != null &&
      mode != null &&
      configurationDefaults != null &&
      localizationDefaults != null &&
      tenantKeyAvailable != null &&
      tenantIdAvailable != null &&
      requiredConfiguration != null &&
      states != null &&
      (value.type !== 'SANDBOX' || (tenants != null && dataSets != null))
    ) {
      const configurationProperties = toConfigurationProperties(
        configurationDefaults,
        value.type,
        mode
      );
      const localizationProperties = toLocalizationProperties(
        localizationDefaults
      );

      this.formGroup = tenantForm(
        mode,
        value,
        configurationProperties,
        localizationProperties,
        tenantKeyAvailable,
        tenantIdAvailable,
        tenants,
        dataSets
      );

      // set the defaults on the formGroup
      this.configurationControlsFormGroup.patchValue({
        required: this.requiredConfiguration
      });

      this.configurationPropertyComparator = join(
        ordering(byString).on<Property>(({ configuration: { name } }) =>
          this.translateService.instant(
            `tenant-configuration-form.group.${name.split('.')[0]}`
          )
        ).compare,
        ordering(byString).on<Property>(({ configuration: { name } }) => name)
          .compare
      );

      this.configurations$ = propertiesProvider(
        this.configurationControlsFormGroup as FormGroup,
        this.formGroup.controls.configurations as FormGroup,
        configurationProperties,
        this.submitted$,
        key => (/^\w+\.(.*)$/.exec(key) || ['', ''])[1], // only match last segment of key
        this.configurationPropertyComparator
      ).pipe(
        takeUntil(this.destroyed$),
        map(({ results, hasSearch, invalid }) => {
          const flattened = keyBy(
            results,
            ({ configuration: { name } }) => name
          );
          const unflattened = unflatten(flattened);
          return toTreeNodes(unflattened, hasSearch || invalid);
        })
      );

      this.localizations$ = propertiesProvider(
        this.localizationControlsFormGroup as FormGroup,
        this.formGroup.controls.localizations as FormGroup,
        localizationProperties,
        of(false)
      ).pipe(
        takeUntil(this.destroyed$),
        map(({ results }) => results)
      );

      // open invalid sections up
      this.submitted$.pipe(takeUntil(this.destroyed$)).subscribe(submitted => {
        if (submitted && this.formGroup.controls.configurations.invalid) {
          this.configurationsOpen$.next(true);
        }
      });

      // apply selected tenant configurations and localizations to the sandbox form
      if (value.type === 'SANDBOX' && mode === 'create') {
        this.formGroup.controls.tenant.valueChanges
          .pipe(
            takeUntil(this.destroyed$),
            startWith(this.formGroup.controls.tenant.value),
            tap(() => {
              this.loadingTenant$.next(true);
            }),
            switchMap(({ code }) =>
              this.tenantService.get(code).pipe(
                finalize(() => {
                  this.loadingTenant$.next(false);
                })
              )
            )
          )
          .subscribe(value => {
            this.onTenantChange(value);
          });
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onTenantChange(tenant: any): void {
    patch(this.formGroup.controls.label, `${tenant.label} Sandbox`);
    // TODO improve by only writing over pristine form fields
    this.formGroup.patchValue({
      configurations: propertyForm(
        toConfigurationProperties(
          this.configurationDefaults,
          tenant.type,
          this.mode
        ),
        tenant.configurations
      ).value,
      localizations: propertyForm(
        toLocalizationProperties(this.localizationDefaults),
        tenant.localizations
      ).value
    });
  }

  onKeyInput(value: string): void {
    setDefaultsUsingTenantKey(
      this.formGroup.controls.configurations as FormGroup,
      value
    );
  }

  onIdInput(value: string): void {
    setDefaultState(
      (this.formGroup.controls.configurations as FormGroup).controls[
        'reporting.state'
      ],
      value,
      this.states
    );
  }

  onSubmit(): void {
    this.submitted$.next(true);

    if (this.formGroup.valid) {
      const emitter = this.mode === 'create' ? this.create : this.update;
      emitter.emit(
        stateToTenant(
          this.value,
          this.configurationDefaults,
          this.localizationDefaults,
          this.formGroup.value,
          this.mode
        )
      );
    } else {
      this.scrollToFirstInvalidFormField();
    }
  }

  private scrollToFirstInvalidFormField(): void {
    const firstInvalidFieldName = getFirstInvalidFormFieldName(
      this.formGroup,
      toConfigurationProperties(
        this.configurationDefaults,
        this.value.type,
        this.mode
      )
        .sort(this.configurationPropertyComparator)
        .map(({ configuration: { name } }) => name)
    );

    if (firstInvalidFieldName == null) {
      return;
    }

    // clear existing interval if present
    if (this.invalidConfigurationInterval != null) {
      clearInterval(this.invalidConfigurationInterval);
    }

    const isConfigurationProperty = !topLevelConfigurationFormFieldNames.includes(
      firstInvalidFieldName
    );

    // open configurations form and select first invalid form field
    if (isConfigurationProperty) {
      // clear searches
      this.configurationControlsFormGroup.patchValue({
        search: '',
        modified: false,
        required: false
      });

      // poll until the form control is rendered
      this.invalidConfigurationInterval = setInterval(
        <TimerHandler>(() => {
          if (firstInvalidFieldName != null) {
            const field = document.querySelector<HTMLElement>(
              `[name="${firstInvalidFieldName}"]`
            );
            if (field != null) {
              field.focus({ preventScroll: false });
              clearInterval(this.invalidConfigurationInterval);
              // mark each as touched and update validation results
              validate(this.formGroup.controls.configurations as FormGroup);
            }
          }
        }),
        this.invalidConfigurationIntervalDuration
      );
    } else {
      const field = document.querySelector<HTMLElement>(
        `[name="${firstInvalidFieldName}"]`
      );
      if (field != null) {
        field.focus({ preventScroll: false });
      }
    }
  }
}
