import { Angulartics2GoogleAnalytics } from "angulartics2";
import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "./user/user.service";
import { Router, NavigationEnd } from "@angular/router";
import { Location, PopStateEvent } from "@angular/common";
import { NotificationService } from "./shared/notification/notification.service";
import { isNullOrUndefined } from "util";
import { User } from "./user/model/user.model";

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html'
})
export class AppComponent {

  private _lastPoppedUrl: string;
  private _user: User;

  get user() {
    return this._user;
  }

  /*
   Even though the angulartics2GoogleAnalytics variable is not explicitly used, without it analytics data is not sent to the service
   */
  constructor(public translate: TranslateService,
              private userService: UserService,
              private router: Router,
              private location: Location,
              private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {

    let languages = [ 'en', 'ja' ];
    let defaultLanguage = languages[ 0 ];
    translate.addLangs(languages);
    translate.setDefaultLang(defaultLanguage);
    translate.use(languages.indexOf(translate.getBrowserLang()) != -1 ? translate.getBrowserLang() : defaultLanguage);
  }

  ngOnInit() {

    this.userService.getCurrentUser().subscribe(user => {
      if (!isNullOrUndefined(user)) {
        this._user = user;

        if (window[ 'ga' ] && user.configuration && user.configuration.analyticsTrackingId) {
          window[ 'ga' ]('create', user.configuration.analyticsTrackingId, 'auto');
        }
      } else {
        this.router.navigate([ 'error' ]);
      }
    });


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
}
