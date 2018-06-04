import { NgModule } from '@angular/core';
import { CommonModule } from '../shared/common.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { AssessmentResultsComponent } from './results/assessment-results.component';
import { AssessmentExamMapper } from './assessment-exam.mapper';
import { ExamStatisticsCalculator } from './results/exam-statistics-calculator';
import { AdvFiltersComponent } from './filters/adv-filters/adv-filters.component';
import { ExamFilterService } from './filters/exam-filters/exam-filter.service';
import { ExamFilterOptionsService } from './filters/exam-filters/exam-filter-options.service';
import { ExamFilterOptionsMapper } from './filters/exam-filters/exam-filter-options.mapper';
import { SelectAssessmentsComponent } from './filters/select-assessments/select-assessments.component';
import { AssessmentsComponent } from './assessments.component';
import { AdvFiltersToggleComponent } from './filters/adv-filters/adv-filters-toggle.component';
import { AverageScaleScoreComponent } from './results/average-scale-score.component';
import { ItemViewerComponent } from './items/item-viewer/item-viewer.component';
import { ItemTabComponent } from './items/item-tab.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Angulartics2Module } from 'angulartics2';
import { ItemExemplarComponent } from './items/item-exemplar/item-exemplar.component';
import { ItemScoringService } from './items/item-exemplar/item-scoring.service';
import { ItemScoringGuideMapper } from './items/item-exemplar/item-scoring-guide.mapper';
import { ItemScoresComponent } from './items/item-scores/item-scores.component';
import { ItemWritingTraitScoresComponent } from './items/item-writing-trait-scores/item-writing-trait-scores.component';
import { StudentScoreService } from './items/item-scores/student-score.service';
import { ItemInfoComponent } from './items/item-info/item-info.component';
import { ItemInfoService } from './items/item-info/item-info.service';
import { BsDropdownModule, PopoverModule } from 'ngx-bootstrap';
import { ClaimTargetComponent } from './results/claim-target.component';
import { ReportModule } from '../report/report.module';
import { ResultsByStudentComponent } from './results/view/results-by-student/results-by-student.component';
import { DistractorAnalysisComponent } from './results/view/distractor-analysis/distractor-analysis.component';
import { WritingTraitScoresComponent } from './results/view/writing-trait-scores/writing-trait-scores.component';
import { ResultsByItemComponent } from './results/view/results-by-item/results-by-item.component';
import { ScaleScoreService } from './results/scale-score.service';
import { InstructionalResourcesService } from './results/instructional-resources.service';
import { InstructionalResourcePopoverComponent } from './popover/instructional-resource-popover.component';
import { RdwMenuModule } from '../shared/menu/rdw-menu.module';
import { AssessmentPercentileModule } from './percentile/assessment-percentile.module';
import { TableModule } from 'primeng/table';
import { TargetReportComponent } from './results/view/target-report/target-report.component';
import { TargetStatisticsCalculator } from './results/target-statistics-calculator';
import { SubgroupModule } from '../aggregate-report/subgroup/subgroup.module';

@NgModule({
  declarations: [
    AdvFiltersComponent,
    AdvFiltersToggleComponent,
    AssessmentsComponent,
    AssessmentResultsComponent,
    ItemTabComponent,
    ItemViewerComponent,
    AverageScaleScoreComponent,
    SelectAssessmentsComponent,
    ItemExemplarComponent,
    ItemScoresComponent,
    ItemWritingTraitScoresComponent,
    ItemInfoComponent,
    ClaimTargetComponent,
    ResultsByItemComponent,
    ResultsByStudentComponent,
    DistractorAnalysisComponent,
    WritingTraitScoresComponent,
    TargetReportComponent,
    InstructionalResourcePopoverComponent
  ],
  imports: [
    Angulartics2Module.forChild(),
    AssessmentPercentileModule,
    BrowserModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    CommonModule,
    DataTableModule,
    FormsModule,
    PopoverModule.forRoot(),
    RdwMenuModule,
    ReportModule,
    SharedModule,
    SubgroupModule,
    TableModule,
    TabsModule
  ],
  exports: [
    AdvFiltersComponent,
    AdvFiltersToggleComponent,
    AssessmentsComponent,
    ItemTabComponent,
    ClaimTargetComponent,
    InstructionalResourcePopoverComponent
  ],
  providers: [
    AssessmentExamMapper,
    ExamStatisticsCalculator,
    ExamFilterService,
    ExamFilterOptionsService,
    ExamFilterOptionsMapper,
    InstructionalResourcesService,
    ItemScoringService,
    ItemScoringGuideMapper,
    ItemInfoService,
    StudentScoreService,
    ScaleScoreService,
    TargetStatisticsCalculator
  ]
})
export class AssessmentsModule {
}
