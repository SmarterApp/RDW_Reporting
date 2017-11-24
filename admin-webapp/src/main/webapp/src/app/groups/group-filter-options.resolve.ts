import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { GroupFilterOptions } from "./model/group-filter-options.model";
import { GroupService } from "./groups.service";
import { Resolution } from "../shared/resolution.model";

@Injectable()
export class GroupFilterOptionsResolve implements Resolve<Resolution<GroupFilterOptions>> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Resolution<GroupFilterOptions>> {
    return this.service.getFilterOptions().catch(Resolution.errorObservable);
  }

  constructor(private service: GroupService) {
  }
}
