import { EventEmitter, Injectable, Output } from "@angular/core";
import { UserPreferenceService } from "../preference/user-preference.service";
import { TranslateService } from "@ngx-translate/core";
import { EmbeddedLanguage, EmbeddedLanguages } from "./language-settings";

/**
 * This repository stores the language setting for the user
 */
@Injectable()
export class LanguageStore {

  @Output()
  languageChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private translateService: TranslateService,
              private userPreferenceService: UserPreferenceService) {

    this.translateService.addLangs(EmbeddedLanguages);
    this.translateService.setDefaultLang(EmbeddedLanguage);
    this.translateService.use(EmbeddedLanguage);
  }

  /**
   * All available languages
   *
   * @returns {string[]}
   */
  get availableLanguages(): string[] {
    return this.translateService.langs;
  }

  set availableLanguages(values: string[]) {
    this.translateService.langs = values;
  }

  /**
   * The current language selection
   *
   * @returns {string}
   */
  get currentLanguage(): string {
    return this.translateService.currentLang;
  }

  set currentLanguage(value: string) {
    if (this.currentLanguage !== value) {
      this.translateService.use(value);
      this.userPreferenceService.setLanguage(value);
      this.languageChange.emit(value);
    }
  }

  /**
   * Initializes the repository with all remotely configured language bundles
   * Make sure to call this at app init time when knowledge of the remotely available languages becomes available
   *
   * @param {string[]} remotelyStoredLanguages
   */
  set configuredLanguages(values: string[]) {
    this.translateService.addLangs(values);
    this.translateService.use(this.getLanguagePreference());
  }

  /**
   * Returns the stored user language preference or the browser language preference when the user has no preference selected.
   *
   * @returns {string}
   */
  private getLanguagePreference(): string {
    const languagePreference = this.userPreferenceService.getLanguage();
    return languagePreference ? languagePreference : this.translateService.getBrowserLang();
  }

}
