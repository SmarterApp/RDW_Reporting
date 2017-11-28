import { Injectable } from "@angular/core";
import { User } from "./model/user.model";
import { Configuration } from "./model/configuration.model";
import { Utils } from "@sbac/rdw-reporting-common-ngx";

@Injectable()
export class UserMapper {

  mapFromApi(remote: any): User {
    let local = new User();
    local.firstName = remote.firstName;
    local.lastName = remote.lastName;
    local.permissions = remote.permissions.concat();
    if (!Utils.isUndefined(remote.settings)) {
      local.configuration = this.mapConfigurationFromApi(remote.settings);
    }
    return local;
  }

  private mapConfigurationFromApi(remote: any): Configuration {
    let local = new Configuration();
    local.analyticsTrackingId = remote.analyticsTrackingId;
    local.homeUrl = remote.homeUrl;
    local.uiLanguages = remote.uiLanguages;
    return local;
  }

}
