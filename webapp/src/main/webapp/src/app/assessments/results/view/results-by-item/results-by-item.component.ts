import { Component, Input, OnInit } from '@angular/core';
import { AssessmentItem } from "../../../model/assessment-item.model";
import { ExportItemsRequest } from "../../../model/export-items-request.model";
import { Angulartics2 } from "angulartics2";
import { DynamicItemField } from "../../../model/item-point-field.model";
import { AssessmentProvider } from "../../../assessment-provider.interface";
import { ExamStatisticsCalculator } from "../../exam-statistics-calculator";
import { Exam } from "../../../model/exam.model";
import { Assessment } from "../../../model/assessment.model";
import { RequestType } from "../../../../shared/enum/request-type.enum";
import { ExportResults } from "../../assessment-results.component";
import { AssessmentExporter } from "../../../assessment-exporter.interface";

@Component({
  selector: 'results-by-item',
  templateUrl: './results-by-item.component.html'
})
export class ResultsByItemComponent implements OnInit, ExportResults {
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
   * Service class which provides export capabilities for this assessment and exam.
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

    if (this.filteredAssessmentItems) {
      this.filteredAssessmentItems = this.filterAssessmentItems(this._assessmentItems);
      this.examCalculator.aggregateItemsByPoints(this.filteredAssessmentItems);
    }
  }

  get exams() {
    return this._exams;
  }

  loading: boolean = false;
  pointColumns: DynamicItemField[];

  private _assessmentItems: AssessmentItem[];
  private filteredAssessmentItems: AssessmentItem[];
  private _exams: Exam[];

  constructor(private angulartics2: Angulartics2, private examCalculator: ExamStatisticsCalculator) {
  }

  ngOnInit() {
    this.loading = true;
    this.assessmentProvider.getAssessmentItems(this.assessment.id).subscribe(assessmentItems => {

      let numOfScores = assessmentItems.reduce((x, y) => x + y.scores.length, 0);

      if (numOfScores != 0) {
        // todo: move?
        this.pointColumns = this.examCalculator.getPointFields(assessmentItems);

        this._assessmentItems = assessmentItems;
        this.filteredAssessmentItems = this.filterAssessmentItems(assessmentItems);

        this.examCalculator.aggregateItemsByPoints(this.filteredAssessmentItems);
      }
      this.loading = false
    });
  }

  hasDataToExport(): boolean {
    return this.filteredAssessmentItems && this.filteredAssessmentItems.length > 0;
  }

  exportToCsv(): void {
    let exportRequest = new ExportItemsRequest();
    exportRequest.assessment = this.assessment;
    exportRequest.assessmentItems = this.filteredAssessmentItems;
    exportRequest.pointColumns = this.pointColumns;
    exportRequest.showAsPercent = this.showValuesAsPercent;
    exportRequest.type = RequestType.ResultsByItems;

    this.assessmentExporter.exportItemsToCsv(exportRequest);
  }

  getPointRowStyleClass(index: number) {
    return index == 0 ? 'level-down' : '';
  }

  private filterAssessmentItems(assessmentItems: AssessmentItem[]) {
    let filtered = [];

    for (let assessmentItem of assessmentItems) {
      let filteredItem = Object.assign(new AssessmentItem(), assessmentItem);
      filteredItem.scores = assessmentItem.scores.filter(score => this._exams.some(exam => exam.id == score.examId));
      filtered.push(filteredItem);
    }

    return filtered;
  }
}
