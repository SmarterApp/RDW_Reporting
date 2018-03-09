import { Injectable } from "@angular/core";
import { User } from "./model/user.model";
import { Group } from "./model/group.model";
import { Configuration } from "./model/configuration.model";
import { Utils } from "../shared/support/support";

@Injectable()
export class UserMapper {

  mapFromApi(apiModel: any): User {
    let uiModel: User = new User();
    uiModel.firstName = apiModel.firstName;
    uiModel.lastName = apiModel.lastName;
    uiModel.permissions = apiModel.permissions.concat();
    uiModel.configuration = this.mapConfigurationFromApi(apiModel.settings);
    return uiModel;
  }

  private mapConfigurationFromApi(apiModel: any): Configuration {
    let uiModel: Configuration = new Configuration();
    if (Utils.isNullOrUndefined(apiModel)) {
      return uiModel;
    }
    uiModel.irisVendorId = apiModel.irisVendorId;
    uiModel.analyticsTrackingId = apiModel.analyticsTrackingId;
    uiModel.interpretiveGuideUrl = apiModel.interpretiveGuideUrl;
    uiModel.userGuideUrl = apiModel.userGuideUrl;
    uiModel.minItemDataYear = apiModel.minItemDataYear;
    uiModel.reportLanguages = apiModel.reportLanguages;
    uiModel.uiLanguages = apiModel.uiLanguages;
    uiModel.transferAccess = apiModel.transferAccess;
    uiModel.percentileDisplayEnabled = apiModel.percentileDisplayEnabled;
    return uiModel;
  }

}
