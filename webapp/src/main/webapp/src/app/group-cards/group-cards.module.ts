import { NgModule } from '@angular/core';
import { IabCardComponent } from './iab-card.component';
import { GroupCardsComponent } from './group-cards.component';
import { ReportModule } from '../report/report.module';
import { Angulartics2Module } from 'angulartics2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssessmentsModule } from '../assessments/assessments.module';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap';
import { UserModule } from '../user/user.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '../shared/common.module';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'primeng/primeng';
import { GroupCardService } from './group-card.service';

@NgModule({
  declarations: [
    GroupCardsComponent,
    IabCardComponent
  ],
  imports: [
    Angulartics2Module.forChild(),
    AssessmentsModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    PopoverModule.forRoot(),
    ReportModule,
    SharedModule,
    TableModule,
    UserModule
  ],
  providers: [
    GroupCardService
  ]
})
export class GroupCardsModule {
}
