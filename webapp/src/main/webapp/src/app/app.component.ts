import { Component, ViewChild } from "@angular/core";
import { UserService } from "./user/user.service";
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from "@angular/router";
import { Location, PopStateEvent, registerLocaleData } from "@angular/common";
import { User } from "./user/user";
import { LanguageStore } from "./shared/i18n/language.store";
import { SpinnerModal } from "./shared/loading/spinner.modal";
import { ApplicationSettings } from './app-settings';
import { ApplicationSettingsService } from './app-settings.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';
import { Angulartics2GoogleAnalytics } from "angulartics2";
import localeEs from '@angular/common/locales/es';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @ViewChild('spinnerModal')
  spinnerModal: SpinnerModal;

  private _lastPoppedUrl: string;
  private _doNotDeleteThisAnalytics: Angulartics2GoogleAnalytics;

  user: User;
  applicationSettings: ApplicationSettings;

  constructor(public languageStore: LanguageStore,
              private router: Router,
              private location: Location,
              private userService: UserService,
              private applicationSettingsService: ApplicationSettingsService,
              angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    /*
      Even though the angulartics2GoogleAnalytics variable is not explicitly used,
      without it analytics data is not sent to the service.  This private variable prevents
      unintended removal by autoformatting
    */
    this._doNotDeleteThisAnalytics = angulartics2GoogleAnalytics;

    this.registerLocales();
  }

  ngOnInit() {

    forkJoin(
      this.userService.getUser(),
      this.applicationSettingsService.getSettings()
    ).pipe(
      catchError((error, values) => {
        this.router.navigate([ 'error' ]);
        return _throw(error);
      })
    ).subscribe(([ user, settings ]) => {

      this.user = user;
      this.applicationSettings = settings;

      this.languageStore.configuredLanguages = settings.uiLanguages;
      this.initializeAnalytics(settings.analyticsTrackingId);
    });

    this.initializeNavigationScrollReset();
    this.initializeNavigationLoadingSpinner();
  }

  scrollToMainContent() {
    setTimeout(() => {
      document.getElementById('maincontent').scrollIntoView();
    }, 0);
  }

  private initializeAnalytics(trackingId: string): void {
    const googleAnalyticsProvider: Function = window[ 'ga' ];
    if (googleAnalyticsProvider && trackingId) {
      googleAnalyticsProvider('create', trackingId, 'auto');
    }
  }

  private initializeNavigationScrollReset(): void {

    // by listening to the PopStateEvent we can track the back button
    this.location.subscribe((event: PopStateEvent) => {
      this._lastPoppedUrl = event.url;
    });

    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      // if the user is going back, don't do the window scroll
      // let the browser take the user back to the position where they last were
      if (event.url == this._lastPoppedUrl) {
        this._lastPoppedUrl = undefined;
      } else {
        window.scrollTo(0, 0);
      }
    });
  }

  private initializeNavigationLoadingSpinner(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.spinnerModal.loading = true;
      } else if (event instanceof NavigationEnd
        || event instanceof NavigationCancel
        || event instanceof NavigationError) {
        this.spinnerModal.loading = false;
      }
    })
  }

  /**
   * Register locales available to the angular system for
   * date, number, currency, etc translations.
   * NOTE: We currently only embed "en" and "es"
   */
  private registerLocales(): void {
    registerLocaleData(localeEs);
  }

}
