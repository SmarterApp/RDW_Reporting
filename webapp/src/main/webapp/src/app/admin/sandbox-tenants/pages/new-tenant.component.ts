import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { TenantService } from '../service/tenant.service';
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
import { PropertyOverrideTreeTableComponent } from '../component/property-override-tree-table.component';
import { NotificationService } from '../../../shared/notification/notification.service';
import { TenantStore } from '../store/tenant.store';

@Component({
  selector: 'new-tenant',
  templateUrl: './new-tenant.component.html'
})
export class NewTenantConfigurationComponent implements OnInit, AfterViewInit {
  tenantForm: FormGroup;
  // Contains the full list of localization overrides, with default values
  localizationOverrides: ConfigurationProperty[] = [];
  // Contains the full list of configuration properties, with default values
  configurationProperties: any;

  @ViewChild('configurationPropertiesTable')
  configurationPropertiesTable: PropertyOverrideTreeTableComponent;

  @ViewChild('tenantKeyInput')
  tenantKeyInput: ElementRef;

  constructor(
    private service: TenantService,
    private formBuilder: FormBuilder,
    private translationLoader: RdwTranslateLoader,
    private router: Router,
    private store: TenantStore,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.tenantForm = this.formBuilder.group({
      key: [
        null,
        [
          Validators.required,
          CustomValidators.tenantKey,
          Validators.maxLength(20)
        ]
      ],
      id: [null, [Validators.required, CustomValidators.tenantKey]],
      label: [null, CustomValidators.notBlank],
      description: [null],
      configurationProperties: this.formBuilder.group({}),
      localizationOverrides: this.formBuilder.group({})
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
    setTimeout(() => this.tenantKeyInput.nativeElement.focus());
  }

  onSubmit(): void {
    const modifiedLocalizationOverrides = this.localizationOverrides.filter(
      override => override.originalValue !== override.value
    );
    const newTenant = {
      ...this.tenantForm.value,
      code: this.tenantForm.get('key').value,
      localizationOverrides: modifiedLocalizationOverrides,
      configurationProperties: this.configurationProperties
    };
    this.service.create(newTenant).subscribe(
      createdTenant => {
        this.store.setState([createdTenant, ...this.store.state]);
        this.router.navigate(['tenants']);
      },
      error =>
        this.notificationService.error({ id: 'tenant-config.errors.create' })
    );
  }

  private mapLocalizationOverrides() {
    this.translationLoader
      .getFlattenedTranslations('en')
      .subscribe(translations => {
        let locationOverrideFormGroup = <FormGroup>(
          this.tenantForm.controls['localizationOverrides']
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
}
