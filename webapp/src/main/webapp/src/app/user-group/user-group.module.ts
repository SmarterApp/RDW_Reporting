import { NgModule } from '@angular/core';
import { UserGroupsComponent } from './user-groups.component';
import { UserGroupService } from './user-group.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '../shared/common.module';
import { PopoverModule } from 'ngx-bootstrap';
import { UserGroupsTableComponent } from './user-groups-table.component';
import { UserGroupResolve } from './user-group.resolve';
import { UserGroupComponent } from './user-group.component';
import { UserGroupOptionsService } from './user-group-options.service';
import { StudentSearchModule } from '../student/search/student-search.module';
import { UserGroupFormComponent } from './user-group-form.component';

@NgModule({
  declarations: [
    UserGroupComponent,
    UserGroupFormComponent,
    UserGroupsComponent,
    UserGroupsTableComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule.forRoot(),
    StudentSearchModule,
    TableModule
  ],
  exports: [
    UserGroupComponent
  ],
  providers: [
    UserGroupService,
    UserGroupOptionsService,
    UserGroupResolve
  ]
})
export class UserGroupModule {

}
