import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { GroupFilterOptions } from "./model/group-filter-options.model";
import { GroupService } from "./groups.service";

@Injectable()
export class GroupFilterOptionsResolve implements Resolve<GroupFilterOptions> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GroupFilterOptions>|Promise<GroupFilterOptions>|GroupFilterOptions {
    return this.service.getFilterOptions();
  }

  constructor(private service: GroupService) {
  }
}
