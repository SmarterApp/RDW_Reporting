import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "./user/user.service";

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html'
})
export class AppComponent {

  private _user;

  get user() {
    return this._user;
  }

  /*
  Even though the angulartics2GoogleAnalytics variable is not explicitly used, without it analytics data is not sent to the service
   */
  constructor(public translate: TranslateService, private _userService: UserService,
              private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {

    let languages = [ 'en', 'ja' ];
    let defaultLanguage = languages[ 0 ];
    translate.addLangs(languages);
    translate.setDefaultLang(defaultLanguage);
    translate.use(languages.indexOf(translate.getBrowserLang()) != -1 ? translate.getBrowserLang() : defaultLanguage);

  }

  ngOnInit() {

    this._userService.getCurrentUser().subscribe(user => {
      this._user = {
        firstName: user.firstName,
        lastName: user.lastName
      };

      if (window['ga'] && user.configuration && user.configuration.analyticsTrackingId) {
        window['ga']('create', user.configuration.analyticsTrackingId, 'auto');
      }
    });
  }
}
