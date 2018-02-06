///<reference path="../../node_modules/@angular/router/src/events.d.ts"/>
import { Component, ViewChild } from "@angular/core";
import { UserService } from "./user/user.service";
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from "@angular/router";
import { Location, PopStateEvent } from "@angular/common";
import { User } from "./user/model/user.model";
import { LanguageStore } from "./shared/i18n/language.store";
import { Utils } from "./shared/support/support";
import { SpinnerModal } from "./shared/loading/spinner.modal";

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @ViewChild('spinnerModal')
  spinnerModal: SpinnerModal;

  private _lastPoppedUrl: string;
  private _user: User;

  get user() {
    return this._user;
  }

  /*
   Even though the angulartics2GoogleAnalytics variable is not explicitly used, without it analytics data is not sent to the service
   */
  constructor(public languageStore: LanguageStore,
              private userService: UserService,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      if (!Utils.isNullOrUndefined(user)) {
        this._user = user;
        this.languageStore.configuredLanguages = user.configuration.uiLanguages;
        this.initializeAnalytics(user.configuration.analyticsTrackingId);
      } else {
        this.router.navigate([ 'error' ]);
      }
    });
    this.initializeNavigationScrollReset();
    this.initializeNavigationLoadingSpinner();
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

}
