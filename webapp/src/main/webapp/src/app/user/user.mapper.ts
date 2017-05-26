import { Injectable } from "@angular/core";
import { User } from "./user.model";

@Injectable()
export class UserMapper {

  mapFromApi(apiModel: any): User {
    let uiModel = new User();

    uiModel.firstName = apiModel.firstName;
    uiModel.lastName = apiModel.lastName;

    apiModel.permissions.forEach(permission => {
      uiModel.permissions.push(permission);
    });

    return uiModel;
  }
}
