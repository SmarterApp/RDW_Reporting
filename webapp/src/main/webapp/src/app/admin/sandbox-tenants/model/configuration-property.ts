export class ConfigurationProperty {
  key: string;
  originalValue: string;
  value: string;
  group?: string;
  formControlName: string;

  constructor(key, value, group = null, originalVal = value) {
    this.key = key;
    this.value = value;
    this.originalValue = originalVal;
    this.group = group;

    if (group) {
      this.formControlName = `${group}.${key}`;
    }
    this.formControlName = key;
  }
}
