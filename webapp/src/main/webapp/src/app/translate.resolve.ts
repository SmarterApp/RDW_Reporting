import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { TranslateService } from "@ngx-translate/core";

/**
 * TODO repackage
 *
 * Resolver that only resolves once the translate getTranslation is complete.
 */
@Injectable()
export class TranslateResolve implements Resolve<string> {

  constructor(private service: TranslateService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    return this.service.get('welcome');
  }

}
