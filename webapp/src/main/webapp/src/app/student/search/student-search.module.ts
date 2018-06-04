import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '../../shared/common.module';
import { StudentSearchFormComponent } from './student-search-form.component';
import { StudentSearchFormOptionsService } from './student-search-form-options.service';
import { StudentService } from './student.service';
import { SchoolAndGroupTypeaheadComponent } from './school-and-group-typeahead.component';
import { SchoolAndGroupTypeaheadOptionMapper } from './school-and-group-typeahead-option.mapper';
import { TypeaheadModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    StudentSearchFormComponent,
    SchoolAndGroupTypeaheadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    TypeaheadModule.forRoot()
  ],
  exports: [
    StudentSearchFormComponent
  ],
  providers: [
    StudentService,
    StudentSearchFormOptionsService,
    SchoolAndGroupTypeaheadOptionMapper
  ]
})
export class StudentSearchModule {

}
