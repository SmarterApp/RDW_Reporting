import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "./user/user.service";
import { User } from "./user/model/user.model";
import { Router } from "@angular/router";

const AdminPermissions = [ "GROUP_WRITE" ];

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html'
})
export class AppComponent {
  private _user: User;

  get user(): User {
    return this._user;
  }

  /*
  Even though the angulartics2GoogleAnalytics variable is not explicitly used, without it analytics data is not sent to the service
   */
  constructor(public translate: TranslateService,
              private _userService: UserService,
              private router: Router,
              private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {

    let languages = [ 'en' ];
    let defaultLanguage = languages[ 0 ];
    translate.addLangs(languages);
    translate.setDefaultLang(defaultLanguage);
    translate.use(defaultLanguage);

  }

  ngOnInit() {
    this._userService.getCurrentUser().subscribe(user => {

      this._user = user;
      let userHasAccess = user.permissions.some(permission => AdminPermissions.indexOf(permission) !== -1);

      if (!userHasAccess) {
        this.router.navigate([ 'access-denied' ]);
      }

      let languages = user.configuration.uiLanguages;
      this.translate.addLangs(languages);
      if (languages.indexOf(this.translate.getBrowserLang()) != -1) {
        this.translate.use(this.translate.getBrowserLang());
      }

      if (window[ 'ga' ] && user.configuration && user.configuration.analyticsTrackingId) {
        window[ 'ga' ]('create', user.configuration.analyticsTrackingId, 'auto');
      }
    });
  }
}
