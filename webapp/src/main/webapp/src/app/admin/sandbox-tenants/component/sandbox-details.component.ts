import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SandboxConfiguration } from '../model/sandbox-configuration';
import { ConfigurationProperty } from '../model/configuration-property';
import { RdwTranslateLoader } from '../../../shared/i18n/rdw-translate-loader';
import { MenuItem } from 'primeng/api';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { SandboxService } from '../service/sandbox.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidators } from '../../../shared/validator/custom-validators';

@Component({
  selector: 'sandbox-details-config',
  templateUrl: './sandbox-details.component.html'
})
export class SandboxConfigurationDetailsComponent implements OnInit {
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
    private translationLoader: RdwTranslateLoader,
    private translateService: TranslateService,
    private service: SandboxService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.sandboxForm = this.formBuilder.group({
      label: [this.sandbox.label, CustomValidators.notBlank],
      description: [this.sandbox.description],
      configurationProperties: this.formBuilder.group({}),
      localizationOverrides: this.formBuilder.group({})
    });
    this.mapLocalizationOverrides();
    this.configureMenuItems();
  }

  private mapLocalizationOverrides() {
    this.translationLoader
      //TODO: Get the correct language code from somewhere, do not hardcode
      .getFlattenedTranslations('en')
      .subscribe(translations => {
        for (let key in translations) {
          let locationOverrideFormGroup = <FormGroup>(
            this.sandboxForm.controls['localizationOverrides']
          );
          if (translations.hasOwnProperty(key)) {
            const value = translations[key];
            const localizationOverrides =
              this.sandbox.localizationOverrides || [];
            const override = localizationOverrides.find(
              override => override.key === key
            );
            if (override) {
              this.localizationOverrides.push(
                new ConfigurationProperty(
                  key,
                  override.value,
                  override.originalValue
                )
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
      });
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
    this.service.update(updatedSandbox);
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
