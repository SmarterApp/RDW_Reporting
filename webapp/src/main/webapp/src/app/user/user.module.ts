import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { UserService } from "./user.service";
import { UserMapper } from "./user.mapper";
import { BrowserModule } from "@angular/platform-browser";
import { UserResolve } from "./user.resolve";
import { PermissionService } from "@sbac/rdw-reporting-common-ngx/security";
import { RdwSecurityModule } from "@sbac/rdw-reporting-common-ngx/security";
import { UserPermissionService } from "./user-permission.service";

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
