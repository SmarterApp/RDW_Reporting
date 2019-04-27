import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataTemplate } from './sandbox-configuration';
import { SandboxService } from './sandbox.service';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl
} from '@angular/forms';
import { RdwTranslateLoader } from '../../shared/i18n/rdw-translate-loader';
import { SandboxConfigurationProperty } from './sandbox-configuration-property';
import { ApplicationSettingsService } from '../../app-settings.service';
import { Utils } from '../../shared/support/support';

@Component({
  selector: 'new-sandbox',
  templateUrl: './new-sandbox.component.html'
})
export class NewSandboxConfigurationComponent {
  dataTemplates: DataTemplate[];
  sandboxForm: FormGroup;
  // Contains the full list of localization overrides, with default values
  localizationOverrides: SandboxConfigurationProperty[] = [];
  // Contains the full list of configuration properties, with default values
  configurationProperties: SandboxConfigurationProperty[] = [];

  constructor(
    private service: SandboxService,
    private formBuilder: FormBuilder,
    private translationLoader: RdwTranslateLoader,
    private router: Router,
    private settingsService: ApplicationSettingsService
  ) {}

  ngOnInit(): void {
    this.sandboxForm = this.formBuilder.group({
      label: [null, Validators.required],
      description: [null],
      template: [null, Validators.required],
      configurationProperties: this.formBuilder.array([]),
      localizationOverrides: this.formBuilder.array([])
    });

    this.service
      .getAvailableDataTemplates()
      .subscribe(templates => (this.dataTemplates = templates));
    this.mapLocalizationOverrides();

    this.settingsService.getSettings().subscribe(configProperties => {
      const configPropertiesFormArray = <FormArray>(
        this.sandboxForm.controls['configurationProperties']
      );
      let flattenedConfigProperties = Utils.flattenJsonObject(configProperties);
      Object.keys(flattenedConfigProperties).forEach(key => {
        const val = flattenedConfigProperties[key] || '';
        this.configurationProperties.push(
          new SandboxConfigurationProperty(key, val)
        );
        configPropertiesFormArray.push(new FormControl(val));
      });
    });
  }

  private mapLocalizationOverrides() {
    this.translationLoader
      .getFlattenedTranslations('en')
      .subscribe(translations => {
        let locationOverrideFormArray = <FormArray>(
          this.sandboxForm.controls['localizationOverrides']
        );
        for (let key in translations) {
          // check also if property is not inherited from prototype
          if (translations.hasOwnProperty(key)) {
            let value = translations[key];
            this.localizationOverrides.push(
              new SandboxConfigurationProperty(key, value)
            );
            locationOverrideFormArray.controls.push(new FormControl(value));
          }
        }
      });
  }

  onSubmit(): void {
    //TODO: This key should be generated in the database. Remove this once the backend is in place
    const randomCode = Math.floor(Math.random() * 9999999) + 1000000;
    const modifiedLocalizationOverrides = this.localizationOverrides.filter(
      override => override.originalValue !== override.value
    );
    const modifiedConfigurationProperties = this.configurationProperties.filter(
      property => property.originalValue !== property.value
    );
    const newSandbox = {
      ...this.sandboxForm.value,
      code: randomCode,
      localizationOverrides: modifiedLocalizationOverrides,
      configurationProperties: modifiedConfigurationProperties
    };
    this.service.create(newSandbox);
    this.router.navigate(['sandboxes']);
  }

  updateOverride(override: SandboxConfigurationProperty, index: number): void {
    const overrides = <FormArray>(
      this.sandboxForm.controls['localizationOverrides']
    );
    const newVal = overrides.controls[index].value;

    if (this.localizationOverrides.indexOf(override) > -1) {
      let existingOverride = this.localizationOverrides[
        this.localizationOverrides.indexOf(override)
      ];
      existingOverride.value = newVal;
    } else {
      override.value = newVal;
      this.localizationOverrides.push(override);
    }
  }

  updateConfigurationProperty(
    property: SandboxConfigurationProperty,
    index: number
  ): void {
    const properties = <FormArray>(
      this.sandboxForm.controls['configurationProperties']
    );
    const newVal = properties.controls[index].value;

    let existingProperty = this.configurationProperties[
      this.configurationProperties.indexOf(property)
    ];
    existingProperty.value = newVal;
  }
}
