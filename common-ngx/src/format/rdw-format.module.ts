import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { SchoolYearPipe } from "./school-year.pipe";

@NgModule({
  declarations: [
    SchoolYearPipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    SchoolYearPipe
  ],
  providers: [
    SchoolYearPipe
  ]
})
export class RdwFormatModule {
}
