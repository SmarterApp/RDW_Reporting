import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ApplicationSettingsService } from './app-settings.service';
import { ApplicationSettings } from './app-settings';

@Injectable()
export class ApplicationSettingsResolve implements Resolve<ApplicationSettings> {

  constructor(private service: ApplicationSettingsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApplicationSettings> {
    return this.service.getSettings();
  }

}
