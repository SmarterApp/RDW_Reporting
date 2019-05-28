import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { DataSet } from '../model/sandbox-configuration';
import { SandboxService } from '../service/sandbox.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { RdwTranslateLoader } from '../../../shared/i18n/rdw-translate-loader';
import { ConfigurationProperty } from '../model/configuration-property';
import { CustomValidators } from '../../../shared/validator/custom-validators';
import { mapConfigurationProperties } from '../mapper/tenant.mapper';

@Component({
  selector: 'new-sandbox',
  templateUrl: './new-sandbox.component.html'
})
export class NewSandboxConfigurationComponent implements OnInit, AfterViewInit {
  dataSets: DataSet[];
  sandboxForm: FormGroup;
  // Contains the full list of localization overrides, with default values
  localizationOverrides: ConfigurationProperty[] = [];
  // Contains the full list of configuration properties, with default values
  configurationProperties: any;

  @ViewChild('sandboxLabelInput')
  sandboxLabelInput: ElementRef;

  constructor(
    private service: SandboxService,
    private formBuilder: FormBuilder,
    private translationLoader: RdwTranslateLoader,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sandboxForm = this.formBuilder.group({
      label: [null, CustomValidators.notBlank],
      description: [null],
      dataSet: [null, Validators.required],
      configurationProperties: this.formBuilder.group({}),
      localizationOverrides: this.formBuilder.group({})
    });

    this.service.getAvailableDataSets().subscribe(dataSets => {
      this.dataSets = dataSets;
    });

    this.mapLocalizationOverrides();

    this.service
      .getDefaultConfigurationProperties()
      .subscribe(
        configProperties =>
          (this.configurationProperties = mapConfigurationProperties(
            configProperties
          ))
      );
  }

  ngAfterViewInit() {
    setTimeout(() => this.sandboxLabelInput.nativeElement.focus());
  }

  private mapLocalizationOverrides() {
    this.translationLoader
      .getFlattenedTranslations('en')
      .subscribe(translations => {
        let locationOverrideFormGroup = <FormGroup>(
          this.sandboxForm.controls['localizationOverrides']
        );
        for (let key in translations) {
          // check also if property is not inherited from prototype
          if (translations.hasOwnProperty(key)) {
            let value = translations[key];
            this.localizationOverrides = [
              ...this.localizationOverrides,
              new ConfigurationProperty(key, value)
            ];
            locationOverrideFormGroup.controls[key] = new FormControl(value);
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
    const newSandbox = {
      ...this.sandboxForm.value,
      code: randomCode,
      localizationOverrides: modifiedLocalizationOverrides,
      configurationProperties: this.configurationProperties
    };
    this.service.create(newSandbox);
    this.router.navigate(['sandboxes']);
  }
}
