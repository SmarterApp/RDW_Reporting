import { Component, Input, OnInit } from '@angular/core';
import { AssessmentItem } from "../../../model/assessment-item.model";
import { Exam } from "../../../model/exam.model";
import { ExamStatisticsCalculator } from "../../exam-statistics-calculator";
import { AssessmentProvider } from "../../../assessment-provider.interface";
import { Assessment } from "../../../model/assessment.model";
import { ExportResults } from "../../assessment-results.component";
import { WritingTraitScoreSummary } from "../../../model/writing-trait-score-summary.model";
import { ExportWritingTraitsRequest } from "../../../model/export-writing-trait-request.model";
import { AssessmentExporter } from "../../../assessment-exporter.interface";
import { WritingTrait } from "../../../model/writing-trait.model";

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
      this.updateResults(this._writingTraitScoredItems);
    }
  }

  get exams(): Exam[] {
    return this._exams;
  }

  writingTraitColumns: Column[];
  loading: boolean = false;
  isWritingTraitItem: boolean = false;
  traitScoreSummaries: WritingTraitScoreSummary[];
  writingTraitType: string;
  filteredItems: AssessmentItem[];

  private _writingTraitScoredItems: AssessmentItem[];
  private _exams: Exam[];
  private _columnsByTraitSummary: Map<WritingTraitScoreSummary, Column[]> = new Map();

  constructor(private examCalculator: ExamStatisticsCalculator) {
  }

  ngOnInit() {
    this.loading = true;

    this.assessmentProvider.getAssessmentItems(this.assessment.id, ['WER']).subscribe(assessmentItems => {
      if (assessmentItems.some(x => x.scores.length > 0)) {
        this._writingTraitScoredItems = assessmentItems;
        this.updateResults(assessmentItems);
      }

      if (assessmentItems.length != 0) {
        this.isWritingTraitItem = true;
        this.writingTraitType = assessmentItems[0].performanceTaskWritingType;
      }

      this.writingTraitColumns = [
        new Column({id: 'number', field: 'position'}),
        new Column({id: 'claim', field: 'claimTarget', headerInfo: true}),
        new Column({id: 'purpose', field: 'writingTraitType', headerInfo: true}),
        new Column({id: 'difficulty', sortField: 'difficultySortOrder', headerInfo: true}),
        new Column({id: 'standard', field: 'commonCoreStandardIds', headerInfo: true}),
        new Column({id: 'full-credit', field: 'fullCredit', headerInfo: true})
      ];

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

  getColumnsForSummary(summary: WritingTraitScoreSummary) {
    return this._columnsByTraitSummary.get(summary) || [];
  }

  get totalType(): string {
    return WritingTrait.total().type;
  }

  private toTraitSummaryColumns(summary: WritingTraitScoreSummary): Column[] {
    return summary.total.numbers.map((points, index) => {
      return new Column({
        id: 'item-point',
        points: points,
        index: index,
        styleClass: index == 0 ? 'level-down' : '',
        sortable: false
      });
    });
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

  private updateResults(items: AssessmentItem[]) {
    this.filteredItems = this.filterItems(items);
    this.traitScoreSummaries = this.examCalculator.aggregateWritingTraitScores(this.filteredItems);
    this.traitScoreSummaries.forEach((summary) => {
      const columns = [
        new Column({id: 'category', sortable: false}),
        new Column({id: 'average-max', sortable: false, styleClass: "level-up"}),
        ...this.toTraitSummaryColumns(summary)
      ];
      this._columnsByTraitSummary.set(summary, columns);
    });
  }
}

class Column {
  id: string;
  field: string;
  sortField: string;
  headerInfo: boolean;
  styleClass: string;
  sortable: boolean;

  // Writing trait item column properties
  index?: number;
  points?: number;

  constructor({
                id,
                field = '',
                sortField = '',
                headerInfo = false,
                styleClass = '',
                sortable = true,
                index = -1,
                points = -1
              }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortField = sortField ? sortField : this.field;
    this.headerInfo = headerInfo;
    this.styleClass = styleClass;
    this.sortable = sortable;
    if (index >= 0) {
      this.index = index;
    }
    if (points >= 0) {
      this.points = points;
    }
  }
}

