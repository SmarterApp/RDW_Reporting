import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PerformanceLevelDisplayTypes } from './performance-level-display-type';
import { ValueDisplayTypes } from './value-display-type';

@Injectable()
export class DisplayOptionService {

  constructor(private translateService: TranslateService) {
  }

  /**
   * @returns {any[]} the common value type display options
   */
  getValueDisplayTypeOptions(): any[] {
    return ValueDisplayTypes.values()
      .map(this.createOptionMapper(
        value => this.translateService.instant(`common.value-display-type.${value}`),
        value => `Value Display Type: ${value}`
      ));
    ;
  }

  /**
   * @returns {any[]} the common performance level display type options
   */
  getPerformanceLevelDisplayTypeOptions(): any[] {
    return PerformanceLevelDisplayTypes.values()
      .map(this.createOptionMapper(
        value => this.translateService.instant(`common.performance-level-display-type.${value}`),
        value => `Achievement Level Display Type: ${value}`
      ));
  }

  /**
   * Creates a generic option class given a translation provider and analytics label provider
   *
   * @param {(value: any) => string} translationProvider
   * @param {(value: any) => string} labelProvider
   * @returns {any}
   */
  createOptionMapper(translationProvider: (value: any) => string, analyticsLabelProvider: (value: any) => string, descriptionProvider?: (value: any) => string, disabledTextProvider?: (value: any) => string): any {
    if (descriptionProvider) {
      return (value: any) => <any>{
        value: value,
        text: translationProvider(value),
        label: analyticsLabelProvider(value),
        description: descriptionProvider(value),
        disabledText: disabledTextProvider(value)
      };
    }
    return (value: any) => <any>{
      value: value,
      text: translationProvider(value),
      label: analyticsLabelProvider(value)
    };
  }

}
