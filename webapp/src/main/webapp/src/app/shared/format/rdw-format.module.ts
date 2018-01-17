import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { SchoolYearPipe } from "./school-year.pipe";
import { SchoolYearsPipe } from "./school-years.pipe";

@NgModule({
  declarations: [
    SchoolYearPipe,
    SchoolYearsPipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    SchoolYearPipe,
    SchoolYearsPipe
  ],
  providers: [
    SchoolYearPipe,
    SchoolYearsPipe
  ]
})
export class RdwFormatModule {
}
