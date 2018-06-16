import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { AdminDropdownComponent } from './admin-dropdown.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '../shared/common.module';
import { SchoolGradeModule } from '../school-grade/school-grade.module';
import { GroupsModule } from '../groups/groups.module';
import { StudentModule } from '../student/student.module';
import { BsDropdownModule } from 'ngx-bootstrap';
import { AdminToolsComponent } from './admin-tools.component';

@NgModule({
  declarations: [
    HomeComponent,
    AdminDropdownComponent,
    AdminToolsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    StudentModule,
    SchoolGradeModule,
    GroupsModule,
    BsDropdownModule.forRoot()
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule {

}
