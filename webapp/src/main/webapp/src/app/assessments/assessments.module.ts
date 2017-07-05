import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { DataTableModule, SharedModule } from "primeng/primeng";
import { AssessmentResultsComponent } from "./results/assessment-results.component";
import { AssessmentExamMapper } from "./assessment-exam.mapper";
import { ExamStatisticsCalculator } from "./results/exam-statistics-calculator";
import { AdvFiltersComponent } from "./filters/adv-filters/adv-filters.component";
import { ExamFilterService } from "./filters/exam-filters/exam-filter.service";
import { ExamFilterOptionsService } from "./filters/exam-filters/exam-filter-options.service";
import { ExamFilterOptionsMapper } from "./filters/exam-filters/exam-filter-options.mapper";
import { SelectAssessmentsComponent } from "./filters/select-assessments/select-assessments.component";
import { PopoverModule } from "ngx-bootstrap/popover";
import { AssessmentsComponent } from "./assessments.component";
import { AdvFiltersToggleComponent } from "./filters/adv-filters/adv-filters-toggle.component";
import { ScaleScoreComponent } from "./results/scale-score.component";

@NgModule({
  declarations: [
    AdvFiltersComponent,
    AdvFiltersToggleComponent,
    AssessmentsComponent,
    AssessmentResultsComponent,
    ScaleScoreComponent,
    SelectAssessmentsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DataTableModule,
    SharedModule,
    PopoverModule
  ],
  exports: [
    AdvFiltersComponent,
    AdvFiltersToggleComponent,
    AssessmentsComponent,
    ScaleScoreComponent
  ],
  providers: [
    AssessmentExamMapper,
    ExamStatisticsCalculator,
    ExamFilterService,
    ExamFilterOptionsService,
    ExamFilterOptionsMapper
  ]
})
export class AssessmentsModule {
}
