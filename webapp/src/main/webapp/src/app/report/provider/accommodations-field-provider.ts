import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Validators } from '@angular/forms';
import { FactoryProvider, InjectionToken } from '@angular/core';

export const AccommodationsField = new InjectionToken('AccommodationsField');

export const useFactory = (translateService: TranslateService) =>
  of({
    name: 'accommodations',
    type: 'toggle',
    validators: [Validators.required],
    info: {
      title: translateService.instant(
        'report-download.form.accommodations-title'
      ),
      content: translateService.instant(
        'report-download.form.accommodations-info'
      )
    },
    options: [
      {
        value: true,
        text: translateService.instant('common.action.show')
      },
      {
        value: false,
        text: translateService.instant('common.action.hide')
      }
    ],
    defaultValue: false,
    // Disabled function intentionally ignores "Show Accommodations" setting for iab,
    // but SB says this is not correct behavior.
    // disabled: formGroup => formGroup.value.assessmentType === 'iab'
    disabled: formGroup => false
  });

export const AccommodationsFieldProvider: FactoryProvider = {
  provide: AccommodationsField,
  deps: [TranslateService],
  useFactory
};
