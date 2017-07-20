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
import { InformationLabelComponent } from "./results/information-label.component";
import { ItemViewerComponent } from './items/item-viewer/item-viewer.component';
import { ItemTabComponent } from './items/item-tab.component';
import { TabsModule } from "ngx-bootstrap/tabs";
import { PopupMenuComponent } from "./menu/popup-menu.component";
import { Angulartics2Module } from 'angulartics2';
import { ItemExemplarComponent } from './items/item-exemplar/item-exemplar.component';
import { ItemScoringService } from "./items/item-exemplar/item-scoring.service";
import { ItemScoringGuideMapper } from "./items/item-exemplar/item-scoring-guide.mapper";
import { ItemScoresComponent } from './items/item-scores/item-scores.component';
import { StudentScoreService } from "./items/item-scores/student-score.service";
import { MenuActionBuilder } from "./menu/menu-action.builder";
import { ItemInfoComponent } from './items/item-info/item-info.component';

@NgModule({
  declarations: [
    AdvFiltersComponent,
    AdvFiltersToggleComponent,
    AssessmentsComponent,
    AssessmentResultsComponent,
    InformationLabelComponent,
    ItemTabComponent,
    ItemViewerComponent,
    PopupMenuComponent,
    ScaleScoreComponent,
    SelectAssessmentsComponent,
    ItemExemplarComponent,
    ItemScoresComponent,
    ItemInfoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    DataTableModule,
    FormsModule,
    PopoverModule,
    SharedModule,
    TabsModule,
    Angulartics2Module.forChild()
  ],
  exports: [
    AdvFiltersComponent,
    AdvFiltersToggleComponent,
    AssessmentsComponent,
    InformationLabelComponent,
    ItemTabComponent,
    PopupMenuComponent,
    ScaleScoreComponent
  ],
  providers: [
    AssessmentExamMapper,
    ExamStatisticsCalculator,
    ExamFilterService,
    ExamFilterOptionsService,
    ExamFilterOptionsMapper,
    ItemScoringService,
    ItemScoringGuideMapper,
    StudentScoreService
  ]
})
export class AssessmentsModule {
}
