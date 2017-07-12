import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { RdwTranslateLoader } from "../shared/rdw-translate-loader";

/**
 * Resolver that only resolves once the translate getTranslation is complete.
 */
@Injectable()
export class TranslateResolve implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.service.observable;
  }

  constructor(private service: RdwTranslateLoader) {
  }
}
