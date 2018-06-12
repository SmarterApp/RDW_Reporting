import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { SchoolYearPipe } from "./school-year.pipe";
import { SchoolYearsPipe } from "./school-years.pipe";
import { SessionPipe } from './session.pipe';

@NgModule({
  declarations: [
    SchoolYearPipe,
    SchoolYearsPipe,
    SessionPipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    SchoolYearPipe,
    SchoolYearsPipe,
    SessionPipe
  ],
  providers: [
    SchoolYearPipe,
    SchoolYearsPipe,
    SessionPipe
  ]
})
export class RdwFormatModule {
}
