import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '../../shared/common.module';
import { StudentSearchFormComponent } from './student-search-form.component';
import { StudentSearchFormOptionsService } from './student-search-form-options.service';
import { StudentService } from './student.service';

@NgModule({
  declarations: [
    StudentSearchFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule
  ],
  exports: [
    StudentSearchFormComponent
  ],
  providers: [
    StudentService,
    StudentSearchFormOptionsService
  ]
})
export class StudentSearchModule {

}
