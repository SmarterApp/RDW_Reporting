import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { UserService } from "./user.service";
import { UserMapper } from "./user.mapper";
import { BrowserModule } from "@angular/platform-browser";
import { UserResolve } from "./user.resolve";
import { UserPermissionService } from "./user-permission.service";
import { PermissionService } from "../shared/security/permission.service";
import { RdwSecurityModule } from "../shared/security/rdw-security.module";

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    RdwSecurityModule
  ],
  providers: [
    UserService,
    UserMapper,
    UserResolve,
    { provide: PermissionService, useClass: UserPermissionService }
  ]
})
export class UserModule {
}
