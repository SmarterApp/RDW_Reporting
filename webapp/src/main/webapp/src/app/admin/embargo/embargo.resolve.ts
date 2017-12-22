import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { EmbargoService } from "./embargo.service";
import { Observable } from "rxjs/Observable";
import { OrganizationType } from "./organization-type.enum";
import { Embargo } from "./embargo";

/**
 * Resolves organization embargoes for display
 */
@Injectable()
export class EmbargoResolve implements Resolve<Map<OrganizationType, Embargo[]>> {

  constructor(private service: EmbargoService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Map<OrganizationType, Embargo[]>> {
    return this.service.getEmbargoesByOrganizationType();
  }

}
