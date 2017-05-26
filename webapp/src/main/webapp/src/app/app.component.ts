import {Component} from "@angular/core";
import {TranslateService} from '@ngx-translate/core';
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

  constructor(private translate: TranslateService, private _userService : UserService) {

    let languages = ['en', 'ja'];
    let defaultLanguage = languages[0];
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
    });
  }
}
