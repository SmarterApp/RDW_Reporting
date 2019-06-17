import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ConfigurationProperty } from '../model/configuration-property';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { TenantConfiguration } from '../model/tenant-configuration';
import { TenantService } from '../service/tenant.service';
import { CustomValidators } from '../../../shared/validator/custom-validators';
import { NotificationService } from '../../../shared/notification/notification.service';
import { TenantStore } from '../store/tenant.store';
import { UserService } from '../../../user/user.service';

@Component({
  selector: 'tenant-details-config',
  templateUrl: './tenant-details.component.html'
})
export class TenantConfigurationDetailsComponent implements OnInit, OnChanges {
  @Input()
  localizationDefaults: any;
  @Input()
  tenant: TenantConfiguration;
  @Output()
  deleteClicked: EventEmitter<TenantConfiguration> = new EventEmitter();

  expanded = false;
  editMode = false;
  readonly = true;
  configurationProperties: any;
  localizationOverrides: ConfigurationProperty[] = [];
  menuItems: MenuItem[];
  tenantForm: FormGroup;
  tempForm: FormGroup;

  constructor(
    private translateService: TranslateService,
    private service: TenantService,
    private store: TenantStore,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.configureMenuItems();
    this.userService.getUser().subscribe(user => {
      this.readonly = !user.permissions.some(perm => perm === 'TENANT_WRITE');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    /*
      Both `tenant` and `localizationDefaults` are provided by the parent component and fetched with asynchronous
      service calls, so he we need to ensure that the tenant and defaults have been defined, and that the form is
      initialized.
     */
    if (this.tenant && this.localizationDefaults) {
      // Make sure a form has been initialized before mapping and processing overrides
      if (!this.tenantForm) {
        this.initializeForm();
      }
      this.mapLocalizationOverrides(this.localizationDefaults);
    }
  }

  editClicked(): void {
    this.tempForm = cloneDeep(this.tenantForm);
    this.editMode = true;
  }

  cancelClicked(): void {
    this.tenantForm = cloneDeep(this.tempForm);
    this.editMode = false;
  }

  onSubmit(): void {
    const modifiedLocalizationOverrides = this.localizationOverrides.filter(
      override => override.originalValue !== override.value
    );

    const updatedTenant = {
      code: this.tenant.code,
      ...this.tenantForm.value,
      localizationOverrides: modifiedLocalizationOverrides,
      configurationProperties: this.tenant.configurationProperties
    };

    this.service.update(updatedTenant).subscribe(
      () => {
        this.store.setState(
          this.store.state.map(existing =>
            existing.code === updatedTenant.code ? updatedTenant : existing
          )
        );
        this.editMode = false;
      },
      error =>
        error.json().message
          ? this.notificationService.error({ id: error.json().message })
          : this.notificationService.error({
              id: 'tenant-config.errors.update'
            })
    );
  }

  private configureMenuItems(): void {
    this.menuItems = [
      {
        label: this.translateService.instant('sandbox-config.actions.delete'),
        icon: 'fa fa-close',
        command: () => this.deleteClicked.emit(this.tenant)
      }
    ];
  }

  private initializeForm(): void {
    if (!this.tenantForm) {
      this.tenantForm = this.formBuilder.group({
        label: [this.tenant.label, CustomValidators.notBlank],
        description: [this.tenant.description],
        configurationProperties: this.formBuilder.group({}),
        localizationOverrides: this.formBuilder.group({})
      });
    }
  }

  private mapLocalizationOverrides(localizationDefaults: any): void {
    for (let key in localizationDefaults) {
      const locationOverrideFormGroup = <FormGroup>(
        this.tenantForm.controls['localizationOverrides']
      );
      if (localizationDefaults.hasOwnProperty(key)) {
        const value = localizationDefaults[key];
        const localizationOverrides = this.tenant.localizationOverrides || [];
        const override = localizationOverrides.find(
          override => override.key === key
        );
        if (override) {
          this.localizationOverrides.push(
            new ConfigurationProperty(key, override.value, undefined, value)
          );
          locationOverrideFormGroup.controls[key] = new FormControl(
            override.value
          );
        } else {
          this.localizationOverrides.push(
            new ConfigurationProperty(key, value)
          );
          locationOverrideFormGroup.controls[key] = new FormControl(value);
        }
      }
    }
  }
}
