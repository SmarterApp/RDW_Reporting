import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { WindowRefService } from "./window-ref.service";
import { StorageService } from "./storage.service";

@NgModule({
  imports: [
    BrowserModule
  ],
  providers: [
    StorageService,
    WindowRefService
  ]
})
export class RdwCoreModule {

}
