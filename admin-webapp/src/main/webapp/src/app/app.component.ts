import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { Component, OnInit } from "@angular/core";
import { UserService } from "./user/user.service";
import { User } from "./user/model/user.model";
import { Router } from "@angular/router";
import { LanguageStore } from "@sbac/rdw-reporting-common-ngx/i18n";

const AdminPermissions = [
  'GROUP_WRITE',
  'INSTRUCTIONAL_RESOURCE_WRITE',
  'EMBARGO_WRITE'
];

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  private _user: User;

  get user(): User {
    return this._user;
  }

  /*
  Even though the angulartics2GoogleAnalytics variable is not explicitly used, without it analytics data is not sent to the service
   */
  constructor(private _userService: UserService,
              public languageStore: LanguageStore,
              private router: Router,
              private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
  }

  ngOnInit() {
    this._userService.getCurrentUser().subscribe(user => {
      const userHasAccess = user.permissions.some(permission => AdminPermissions.indexOf(permission) !== -1);
      if (!userHasAccess) {
        this.router.navigate([ 'access-denied' ]);
      }
      this._user = user;
      this.languageStore.configuredLanguages = user.configuration.uiLanguages;
      this.initializeAnalytics(user.configuration.analyticsTrackingId);
    });
  }

  private initializeAnalytics(trackingId: string): void {
    const googleAnalyticsProvider: Function = window[ 'ga' ];
    if (googleAnalyticsProvider && trackingId) {
      googleAnalyticsProvider('create', trackingId, 'auto');
    }
  }

}
