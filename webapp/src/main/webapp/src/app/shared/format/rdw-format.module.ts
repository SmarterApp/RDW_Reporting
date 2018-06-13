import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { SchoolYearPipe } from "./school-year.pipe";
import { SchoolYearsPipe } from "./school-years.pipe";
import { SessionPipe } from './session.pipe';
import { StudentNamePipe } from './student-name.pipe';
import { StudentNameService } from './student-name.service';

@NgModule({
  declarations: [
    SchoolYearPipe,
    SchoolYearsPipe,
    SessionPipe,
    StudentNamePipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    SchoolYearPipe,
    SchoolYearsPipe,
    SessionPipe,
    StudentNamePipe
  ],
  providers: [
    SchoolYearPipe,
    SchoolYearsPipe,
    SessionPipe,
    StudentNamePipe,
    StudentNameService
  ]
})
export class RdwFormatModule {
}
