import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { DataSet, SandboxConfiguration } from '../model/sandbox-configuration';
import { ConfigurationProperty } from '../model/configuration-property';
import { MenuItem } from 'primeng/api';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { SandboxService } from '../service/sandbox.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidators } from '../../../shared/validator/custom-validators';
import { SandboxStore } from '../store/sandbox.store';
import { NotificationService } from '../../../shared/notification/notification.service';

@Component({
  selector: 'sandbox-details-config',
  templateUrl: './sandbox-details.component.html'
})
export class SandboxConfigurationDetailsComponent implements OnInit, OnChanges {
  @Input()
  localizationDefaults: any;
  @Input()
  sandbox: SandboxConfiguration;
  @Output()
  deleteClicked: EventEmitter<SandboxConfiguration> = new EventEmitter();
  @Output()
  archiveClicked: EventEmitter<SandboxConfiguration> = new EventEmitter();
  @Output()
  resetDataClicked: EventEmitter<SandboxConfiguration> = new EventEmitter();

  expanded = false;
  editMode = false;
  configurationProperties: any;
  localizationOverrides: ConfigurationProperty[] = [];
  menuItems: MenuItem[];
  sandboxForm: FormGroup;
  tempForm: FormGroup;

  constructor(
    private store: SandboxStore,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private service: SandboxService,
    private formBuilder: FormBuilder
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    /*
      Both `sandbox` and `localizationDefaults` are provided by the parent component and fetched with asynchronous
      service calls, so he we need to ensure that the sandbox and defaults have been defined, and that the form is
      initialized.
     */
    if (this.sandbox && this.localizationDefaults) {
      // Make sure a form has been initialized before mapping and processing overrides
      if (!this.sandboxForm) {
        this.initializeForm();
      }
      this.mapLocalizationOverrides(this.localizationDefaults);
    }
  }

  ngOnInit(): void {
    this.initializeForm();
    this.configureMenuItems();
  }

  private initializeForm() {
    if (!this.sandboxForm) {
      this.sandboxForm = this.formBuilder.group({
        label: [this.sandbox.label, CustomValidators.notBlank],
        description: [this.sandbox.description],
        configurationProperties: this.formBuilder.group({}),
        localizationOverrides: this.formBuilder.group({})
      });
    }
  }

  private mapLocalizationOverrides(localizationDefaults: any): void {
    for (let key in localizationDefaults) {
      const locationOverrideFormGroup = <FormGroup>(
        this.sandboxForm.controls['localizationOverrides']
      );
      if (localizationDefaults.hasOwnProperty(key)) {
        const value = localizationDefaults[key];
        const localizationOverrides = this.sandbox.localizationOverrides || [];
        const override = localizationOverrides.find(o => o.key === key);
        if (override) {
          this.localizationOverrides.push(
            new ConfigurationProperty(key, override.value, value)
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

  editClicked(): void {
    this.tempForm = cloneDeep(this.sandboxForm);
    this.editMode = true;
  }

  cancelClicked(): void {
    this.sandboxForm = cloneDeep(this.tempForm);
    this.editMode = false;
  }

  onSubmit(): void {
    const modifiedLocalizationOverrides = this.localizationOverrides.filter(
      override => override.originalValue !== override.value
    );

    const updatedSandbox = {
      code: this.sandbox.code,
      dataSet: this.sandbox.dataSet,
      ...this.sandboxForm.value,
      localizationOverrides: modifiedLocalizationOverrides,
      configurationProperties: this.sandbox.configurationProperties
    };
    this.service.update(updatedSandbox).subscribe(
      () => {
        this.store.setState(
          this.store.state.map(existing =>
            existing.code === updatedSandbox.code ? updatedSandbox : existing
          )
        );
      },
      error =>
        this.notificationService.error({ id: 'sandbox-config.errors.update' })
    );
    this.editMode = false;
  }

  private configureMenuItems(): void {
    this.menuItems = [
      {
        label: this.translateService.instant('sandbox-config.actions.reset'),
        icon: 'fa fa-refresh',
        command: () => this.resetDataClicked.emit(this.sandbox)
      },
      {
        label: this.translateService.instant('sandbox-config.actions.archive'),
        icon: 'fa fa-archive',
        command: () => this.archiveClicked.emit(this.sandbox)
      },
      {
        label: this.translateService.instant('sandbox-config.actions.delete'),
        icon: 'fa fa-close',
        command: () => this.deleteClicked.emit(this.sandbox)
      }
    ];
  }
}
