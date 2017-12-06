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
import { AssessmentsComponent } from "./assessments.component";
import { AdvFiltersToggleComponent } from "./filters/adv-filters/adv-filters-toggle.component";
import { ScaleScoreComponent } from "./results/scale-score.component";
import { AverageScaleScoreComponent } from "./results/average-scale-score.component";
import { ItemViewerComponent } from "./items/item-viewer/item-viewer.component";
import { ItemTabComponent } from "./items/item-tab.component";
import { TabsModule } from "ngx-bootstrap/tabs";
import { PopupMenuComponent } from "./menu/popup-menu.component";
import { Angulartics2Module } from "angulartics2";
import { ItemExemplarComponent } from "./items/item-exemplar/item-exemplar.component";
import { ItemScoringService } from "./items/item-exemplar/item-scoring.service";
import { ItemScoringGuideMapper } from "./items/item-exemplar/item-scoring-guide.mapper";
import { ItemScoresComponent } from "./items/item-scores/item-scores.component";
import { StudentScoreService } from "./items/item-scores/student-score.service";
import { ItemInfoComponent } from "./items/item-info/item-info.component";
import { ItemInfoService } from "./items/item-info/item-info.service";
import { BsDropdownModule, PopoverModule } from "ngx-bootstrap";
import { ClaimTargetComponent } from "./results/claim-target.component";
import { ReportModule } from "../report/report.module";
import { ResultsByStudentComponent } from './results/view/results-by-student/results-by-student.component';
import { DistractorAnalysisComponent } from './results/view/distractor-analysis/distractor-analysis.component';
import { ResultsByItemComponent } from "./results/view/results-by-item/results-by-item.component";
import { ScaleScoreService } from "./results/scale-score.service";
import { InstructionalResourcesService } from "./results/instructional-resources.service";
import { InstructionalResourcesComponent } from "./results/instructional-resources.component";
import { InstructionalResourcesMapper } from "./results/instructional-resources.mapper";

@NgModule({
  declarations: [
    AdvFiltersComponent,
    AdvFiltersToggleComponent,
    AssessmentsComponent,
    AssessmentResultsComponent,
    ItemTabComponent,
    ItemViewerComponent,
    PopupMenuComponent,
    ScaleScoreComponent,
    AverageScaleScoreComponent,
    SelectAssessmentsComponent,
    ItemExemplarComponent,
    ItemScoresComponent,
    ItemInfoComponent,
    ClaimTargetComponent,
    ResultsByItemComponent,
    ResultsByStudentComponent,
    DistractorAnalysisComponent,
    InstructionalResourcesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    CommonModule,
    DataTableModule,
    FormsModule,
    PopoverModule.forRoot(),
    SharedModule,
    TabsModule,
    Angulartics2Module.forChild(),
    ReportModule,
  ],
  exports: [
    AdvFiltersComponent,
    AdvFiltersToggleComponent,
    AssessmentsComponent,
    ItemTabComponent,
    PopupMenuComponent,
    ScaleScoreComponent,
    ClaimTargetComponent,
    InstructionalResourcesComponent
  ],
  providers: [
    AssessmentExamMapper,
    ExamStatisticsCalculator,
    ExamFilterService,
    ExamFilterOptionsService,
    ExamFilterOptionsMapper,
    InstructionalResourcesMapper,
    ItemScoringService,
    ItemScoringGuideMapper,
    ItemInfoService,
    StudentScoreService,
    ScaleScoreService,
    InstructionalResourcesService
  ]
})
export class AssessmentsModule {
}
