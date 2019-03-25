import { NgModule } from '@angular/core';
import { CommonModule } from '../shared/common.module';
import { GroupsComponent } from './groups.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/primeng';
import { GroupResultsComponent } from './results/group-results.component';
import { AssessmentsModule } from '../assessments/assessments.module';
import { GroupAssessmentService } from './results/group-assessment.service';
import { GroupAssessmentResolve } from './results/group-assessment.resolve';
import { Angulartics2Module } from 'angulartics2';
import { ReportModule } from '../report/report.module';
import { PopoverModule, TabsModule } from 'ngx-bootstrap';
import { UserModule } from '../user/user.module';
import { GroupAssessmentExportService } from './results/group-assessment-export.service';
import { GroupService } from './group.service';
import { TableModule } from 'primeng/table';
import { UserGroupModule } from '../user-group/user-group.module';
import { GroupTableComponent } from './group-table.component';
import { GroupTabsComponent } from './group-tabs.component';

@NgModule({
  declarations: [
    GroupsComponent,
    GroupTableComponent,
    GroupTabsComponent,
    GroupResultsComponent
  ],
  imports: [
    Angulartics2Module.forRoot(),
    AssessmentsModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    PopoverModule.forRoot(),
    ReportModule,
    SharedModule,
    TableModule,
    TabsModule.forRoot(),
    UserModule,
    UserGroupModule
  ],
  exports: [
    GroupTabsComponent
  ],
  providers: [
    GroupService,
    GroupAssessmentResolve,
    GroupAssessmentService,
    GroupAssessmentExportService
  ]
})
export class GroupsModule {
}
