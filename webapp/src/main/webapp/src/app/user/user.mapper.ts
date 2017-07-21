import { Injectable } from "@angular/core";
import { User } from "./model/user.model";
import { School } from "./model/school.model";
import { Group } from "./model/group.model";
import { ordering } from "@kourge/ordering";
import { byString } from "@kourge/ordering/comparator";
import { isNullOrUndefined } from "util";
import { Configuration } from "./model/configuration.model";

@Injectable()
export class UserMapper {

  mapFromApi(apiModel: any): User {
    let uiModel = new User();
    if (!apiModel) return uiModel;

    uiModel.firstName = apiModel.firstName;
    uiModel.lastName = apiModel.lastName;

    apiModel.permissions.forEach(permission => {
      uiModel.permissions.push(permission);
    });

    uiModel.schools = this.mapSchoolsFromApi(apiModel.schools);
    uiModel.groups = this.mapGroupsFromApi(apiModel.groups);
    uiModel.configuration = this.mapConfigurationFromApi(apiModel.settings);

    return uiModel;
  }

  private mapSchoolsFromApi(schools: any[]): School[] {
    return isNullOrUndefined(schools)
      ? []
      : schools
        .filter(school => this.isSchoolValid(school))
        .map(school => this.mapSchoolFromApi(school))
        .sort(ordering(byString).on<School>(school => school.name).compare);
  }

  private isSchoolValid(school: any) {
    return !isNullOrUndefined(school)
      && !isNullOrUndefined(school.id)
      && !isNullOrUndefined(school.name);
  }

  private mapSchoolFromApi(apiModel: any): School {
    let uiModel = new School();

    uiModel.id = apiModel.id;
    uiModel.name = apiModel.name;

    return uiModel;
  }

  private mapGroupsFromApi(groups: any[]): Group[] {
    return isNullOrUndefined(groups)
      ? []
      : groups
        .filter(group => this.isGroupValid(group))
        .map(group => this.mapGroupFromApi(group))
        .sort(ordering(byString).on<Group>(group => group.name).compare);
  }

  private isGroupValid(group: any) {
    return !isNullOrUndefined(group)
      && !isNullOrUndefined(group.id)
      && !isNullOrUndefined(group.name);
  }

  private mapGroupFromApi(apiModel: any): Group {
    let uiModel = new Group();

    uiModel.id = apiModel.id;
    uiModel.name = apiModel.name;
    uiModel.schoolName = apiModel.schoolName;
    uiModel.subjectId = apiModel.subjectId;

    return uiModel;
  }

  private mapConfigurationFromApi(apiModel: any): Configuration {
    let uiModel = new Configuration();

    if(isNullOrUndefined(apiModel))
      return uiModel;

    uiModel.irisUrl = apiModel.irisUrl;
    uiModel.irisVendorId = apiModel.irisVendorId;
    uiModel.analyticsTrackingId = apiModel.analyticsTrackingId;

    return uiModel;
  }
}
