import { Injectable } from "@angular/core";
import { User } from "./model/user.model";
import { isNullOrUndefined } from "util";
import { Configuration } from "./model/configuration.model";

@Injectable()
export class UserMapper {

  mapFromApi(remote: any): User {
    let local = new User();
    local.firstName = remote.firstName;
    local.lastName = remote.lastName;
    remote.permissions.forEach(permission => {
      local.permissions.push(permission);
    });
    local.configuration = this.mapConfigurationFromApi(remote.settings);
    return local;
  }

  private mapConfigurationFromApi(remote: any): Configuration {
    let local = new Configuration();
    if (isNullOrUndefined(remote))
      return local;

    local.analyticsTrackingId = remote.analyticsTrackingId;
    local.homeUrl = remote.homeUrl;
    return local;
  }

}
