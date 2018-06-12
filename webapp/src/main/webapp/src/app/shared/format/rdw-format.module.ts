import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { SchoolYearPipe } from "./school-year.pipe";
import { SchoolYearsPipe } from "./school-years.pipe";
import { StudentNamePipe } from './student-name.pipe';
import { StudentNameService } from './student-name.service';

@NgModule({
  declarations: [
    SchoolYearPipe,
    SchoolYearsPipe,
    StudentNamePipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    SchoolYearPipe,
    SchoolYearsPipe,
    StudentNamePipe
  ],
  providers: [
    SchoolYearPipe,
    SchoolYearsPipe,
    StudentNamePipe,
    StudentNameService
  ]
})
export class RdwFormatModule {
}
