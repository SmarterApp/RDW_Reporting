import { Component, Input, ViewChild } from '@angular/core';
import { ConfigurationProperty } from '../model/configuration-property';
import { FormGroup } from '@angular/forms';
import { DataTable } from 'primeng/primeng';

@Component({
  selector: 'property-override-table',
  templateUrl: './property-override-table.component.html'
})
//TODO: Implement ControlValueAccessor
export class PropertyOverrideTableComponent {
  private _configurationProperties: ConfigurationProperty[] = [];

  get configurationProperties(): ConfigurationProperty[] {
    return this._configurationProperties;
  }

  @Input()
  set configurationProperties(
    configurationProperties: ConfigurationProperty[]
  ) {
    this._configurationProperties = configurationProperties;

    if (
      !this.filteredConfigurationProperties &&
      configurationProperties.length > 0
    ) {
      this.filteredConfigurationProperties = configurationProperties;
    }
  }

  @Input()
  propertiesArrayName: string;
  @Input()
  form: FormGroup;
  @ViewChild('dt') dataTable: DataTable;

  showModifiedPropertiesOnly = false;
  filteredConfigurationProperties: ConfigurationProperty[];
  first = 0;

  constructor() {}

  updateOverride(override: ConfigurationProperty): void {
    const formGroup = <FormGroup>this.form.controls[this.propertiesArrayName];
    const formControl = formGroup.controls[override.key];
    const newVal = formControl.value;
    const configurationProperty = this.configurationProperties.find(
      property => property.key === override.key
    );

    configurationProperty.value = newVal;
    override.value = newVal;
  }

  updatePropertiesFilter(): void {
    if (this.showModifiedPropertiesOnly) {
      this.filteredConfigurationProperties = this.configurationProperties.filter(
        prop => prop.value !== prop.originalValue
      );
    } else {
      this.filteredConfigurationProperties = this.configurationProperties;
    }
    // Reset the page back to the first page. Otherwise we can end up "trapped" in an empty page
    this.first = 0;
  }

  resetClicked(override: ConfigurationProperty) {
    override.value = override.originalValue;
    this.updatePropertiesFilter();
  }
}
