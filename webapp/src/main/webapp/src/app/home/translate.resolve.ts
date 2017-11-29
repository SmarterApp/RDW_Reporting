import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { TranslateService } from "@ngx-translate/core";

/**
 * Resolver that only resolves once the translate getTranslation is complete.
 */
@Injectable()
export class TranslateResolve implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string>|Promise<string>|string {
    return this.service.get("welcome");
  }

  constructor(private service: TranslateService) {
  }
}
