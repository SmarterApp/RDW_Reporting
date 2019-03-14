import { FactoryProvider } from '@angular/core/src/di/provider';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationSettingsService } from '../../app-settings.service';
import { map } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { InjectionToken } from '@angular/core';

export const LanguageField = new InjectionToken('LanguageField');

export const useFactory = (
  translateService: TranslateService,
  settingsService: ApplicationSettingsService
) =>
  settingsService.getSettings().pipe(
    map(({ reportLanguages }) => ({
      name: 'language',
      type: 'select',
      validators: [Validators.required],
      label: translateService.instant('report-download.form.language-header'),
      options: reportLanguages.map(value => ({
        value,
        text: translateService.instant(
          `report-download.form.language-option.${value}`
        )
      })),
      defaultValue: reportLanguages[0],
      excluded: reportLanguages == null || reportLanguages.length < 2
    }))
  );

export const LanguageFieldProvider: FactoryProvider = {
  provide: LanguageField,
  deps: [TranslateService, ApplicationSettingsService],
  useFactory
};
