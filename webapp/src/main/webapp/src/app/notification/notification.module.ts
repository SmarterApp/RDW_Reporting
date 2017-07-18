import { NgModule } from "@angular/core";
import { NotificationService } from "./notification.service";
import { NotificationComponent } from "./notification.component";
import { AlertModule } from "ngx-bootstrap";
import { CommonModule } from "../shared/common.module";
import { BrowserModule } from "@angular/platform-browser";
import { CookieModule } from "ngx-cookie";

@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [
    AlertModule,
    BrowserModule,
    CommonModule,
    CookieModule.forChild()
  ],
  exports: [
    NotificationComponent
  ],
  providers: [
    NotificationService
  ]
})
export class NotificationModule {
}
