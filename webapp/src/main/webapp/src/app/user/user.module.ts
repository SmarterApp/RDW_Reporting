import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { UserService } from "./user.service";
import { AuthorizeDirective } from "./authorize.directive";
import { UserMapper } from "./user.mapper";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
  declarations: [ AuthorizeDirective ],
  imports: [ CommonModule, BrowserModule ],
  exports: [ AuthorizeDirective ],
  providers: [ UserMapper, UserService ]
})
export class UserModule {
}
