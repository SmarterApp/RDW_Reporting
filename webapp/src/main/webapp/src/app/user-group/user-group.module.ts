import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '../shared/common.module';
import { ModalModule, PopoverModule } from 'ngx-bootstrap';
import { UserGroupResolve } from './user-group.resolve';
import { UserGroupComponent } from './user-group.component';
import { StudentSearchModule } from '../student/search/student-search.module';
import { UserGroupFormComponent } from './user-group-form.component';
import { UserGroupsComponent } from './user-groups.component';
import { UserGroupTableComponent } from './user-group-table.component';

@NgModule({
  declarations: [
    UserGroupComponent,
    UserGroupFormComponent,
    UserGroupsComponent,
    UserGroupTableComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    StudentSearchModule,
    TableModule
  ],
  providers: [UserGroupResolve],
  exports: [UserGroupsComponent]
})
export class UserGroupModule {}
