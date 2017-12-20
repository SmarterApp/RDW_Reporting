import { Angulartics2Module } from "angulartics2";
import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { DataTableModule } from "primeng/primeng";
import { AggregateReportsComponent } from "./aggregate-reports.component";
import { AggregateReportsResultsComponent } from "./results/aggregate-reports-results.component";

@NgModule({
  declarations: [
    AggregateReportsComponent,
    AggregateReportsResultsComponent
  ],
  imports: [
    Angulartics2Module.forChild(),
    CommonModule,
    DataTableModule
  ],
  exports: [
    AggregateReportsComponent,
    AggregateReportsResultsComponent
  ],
  providers: [
  ]
})
export class AggregateReportsModule {
}
