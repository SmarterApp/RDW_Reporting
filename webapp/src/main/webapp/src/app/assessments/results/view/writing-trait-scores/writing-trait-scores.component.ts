import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { AssessmentItem } from "../../../model/assessment-item.model";
import { Exam } from "../../../model/exam.model";
import { ExamStatisticsCalculator } from "../../exam-statistics-calculator";
import { AssessmentProvider } from "../../../assessment-provider.interface";
import { Assessment } from "../../../model/assessment.model";
import { Angulartics2 } from "angulartics2";
import { ExportResults } from "../../assessment-results.component";
import { WritingTraitScoreSummary } from "../../../model/writing-trait-score-summary.model";
import { ExportWritingTraitsRequest } from "../../../model/export-writing-trait-request.model";
import { AssessmentExporter } from "../../../assessment-exporter.interface";

@Component({
  selector: 'writing-trait-scores',
  templateUrl: './writing-trait-scores.component.html'
})
export class WritingTraitScoresComponent implements OnInit, ExportResults {
  /**
   * If true, values will be shown as percentages
   */
  @Input()
  showValuesAsPercent: boolean;

  /**
   * Service class which provides assessment data for this assessment and exam.
   */
  @Input()
  assessmentProvider: AssessmentProvider;

  /**
   * Service class which provides export capabilities=for this assessment and exam.
   */
  @Input()
  assessmentExporter: AssessmentExporter;

  /**
   * The assessment
   */
  @Input()
  assessment: Assessment;

  /**
   * The exams to show items for.
   */
  @Input()
  set exams(value: Exam[]) {
    this._exams = value;

    if (this.filteredItems) {
      this.filteredItems = this.filterItems(this._writingTraitScoredItems);
      this.traitScoreSummaries = this.examCalculator.aggregateWritingTraitScores(this.filteredItems);
    }
  }

  get exams(): Exam[] {
    return this._exams;
  }

  loading: boolean = false;
  isWritingTraitItem: boolean = false;
  traitScoreSummaries: WritingTraitScoreSummary[];
  writingTraitType: string;

  private _writingTraitScoredItems: AssessmentItem[];
  private filteredItems: AssessmentItem[];
  private _exams: Exam[];

  constructor(private examCalculator: ExamStatisticsCalculator, private renderer: Renderer2, private angulartics2: Angulartics2) {
  }

  ngOnInit() {
    this.loading = true;

    this.assessmentProvider.getAssessmentItems(this.assessment.id, ['WER']).subscribe(assessmentItems => {
      if (assessmentItems.some(x => x.scores.length > 0)) {
        this._writingTraitScoredItems = assessmentItems;

        this.filteredItems = this.filterItems(assessmentItems);
        this.traitScoreSummaries = this.examCalculator.aggregateWritingTraitScores(assessmentItems);
      }

      if (assessmentItems.length != 0) {
        this.isWritingTraitItem = true;
        this.writingTraitType = assessmentItems[0].performanceTaskWritingType;
      }

      this.loading = false
    });
  }

  hasDataToExport(): boolean {
    return this.filteredItems && this.filteredItems.length > 0;
  }

  exportToCsv(): void {
    let exportRequest = new ExportWritingTraitsRequest();
    exportRequest.assessment = this.assessment;
    exportRequest.showAsPercent = this.showValuesAsPercent;
    exportRequest.assessmentItems = this.filteredItems;
    exportRequest.summaries = this.traitScoreSummaries;

    this.assessmentExporter.exportWritingTraitScoresToCsv(exportRequest);
  }

  getPointRowStyleClass(index: number) {
    return index == 0
      ? 'level-down'
      : '';
  }

  private filterItems(items: AssessmentItem[]) {
    let filtered = [];

    for (let item of items) {
      let filteredItem = Object.assign(new AssessmentItem(), item);
      filteredItem.scores = item.scores.filter(score => this._exams.some(exam => exam.id == score.examId));
      filtered.push(filteredItem);
    }

    return filtered;
  }
}
