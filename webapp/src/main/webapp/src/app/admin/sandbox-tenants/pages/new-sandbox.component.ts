import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { RdwTranslateLoader } from '../../../shared/i18n/rdw-translate-loader';
import { NotificationService } from '../../../shared/notification/notification.service';
import { CustomValidators } from '../../../shared/validator/custom-validators';
import { ConfigurationProperty } from '../model/configuration-property';
import { DataSet } from '../model/sandbox-configuration';
import { SandboxService } from '../service/sandbox.service';
import { SandboxStore } from '../store/sandbox.store';

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
    private store: SandboxStore,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private translationLoader: RdwTranslateLoader,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sandboxForm = this.formBuilder.group({
      label: [null, CustomValidators.notBlank],
      description: [null],
      dataSetId: [null, Validators.required],
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
        configProperties => (this.configurationProperties = configProperties)
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
    const modifiedLocalizationOverrides = this.localizationOverrides.filter(
      override => override.originalValue !== override.value
    );
    const newSandbox = {
      ...this.sandboxForm.value,
      dataSet: this.dataSets.find(
        dataSet => dataSet.id === this.sandboxForm.value.dataSetId
      ),
      localizationOverrides: modifiedLocalizationOverrides,
      configurationProperties: this.configurationProperties
    };

    this.service.create(newSandbox, this.dataSets).subscribe(
      createdTenant => {
        this.store.setState([createdTenant, ...this.store.state]);
        this.router.navigate(['sandboxes']);
      },
      error =>
        error.json().message
          ? this.notificationService.error({ id: error.json().message })
          : this.notificationService.error({
              id: 'sandbox-config.errors.create'
            })
    );
  }
}
