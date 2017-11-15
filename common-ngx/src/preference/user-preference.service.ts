import { Injectable } from "@angular/core";
import { WindowRefService } from "../core/window-ref.service";
import { CookieService } from "angular2-cookie/services/cookies.service";

const languageCookieKey: string = 'rdw.user-language';
const languageCookieYearsToExpire: number = 10;

/**
 * This service is responsible for managing user preferences
 */
@Injectable()
export class UserPreferenceService {

  private window: any;

  constructor(private windowReferenceService: WindowRefService,
              private cookieService: CookieService) {
    this.window = windowReferenceService.nativeWindow;
  }

  getLanguage(): string {
    return this.cookieService.get(languageCookieKey);
  }

  setLanguage(languageCode: string): void {

    // Sets cookie to expire in the far future
    const date: Date = new Date();
    date.setFullYear(date.getFullYear() + languageCookieYearsToExpire);

    this.cookieService.put(languageCookieKey, languageCode, {
      path: '/',
      domain: this.getParentDomain(),
      expires: date
    });
  }

  /**
   * Gets the parent domain of the current domain so as to share the preference across domains.
   *
   * WARNING:
   * This is intended to enable sharing of the preference across admin and reporting webapp domains
   * Supports domain naming like: admin.xyz.com, reporting.xyz.com
   * Does not support naming like: staging.admin.xyz.com, staging.reporting.xyz.com
   *
   * @returns {string}
   */
  private getParentDomain(): string {
    const domainParts: string[] = this.window.location.hostname.split('.');
    return (domainParts.length < 3 ? domainParts : domainParts.slice(1)).join('.');
  }

}
