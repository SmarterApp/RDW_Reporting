import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { AssessmentItem } from "../../../model/assessment-item.model";
import { Exam } from "../../../model/exam.model";
import { DynamicItemField } from "../../../model/item-point-field.model";
import { ExamStatisticsCalculator } from "../../exam-statistics-calculator";
import { AssessmentProvider } from "../../../assessment-provider.interface";
import { ExportRequest } from "../../../model/export-request.model";
import { Assessment } from "../../../model/assessment.model";
import { Angulartics2 } from "angulartics2";
import { RequestType } from "../../../../shared/enum/request-type.enum";

@Component({
  selector: 'distractor-analysis',
  templateUrl: './distractor-analysis.component.html'
})
export class DistractorAnalysisComponent implements OnInit {
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

    if (this.filteredMultipleChoiceItems) {
      this.filteredMultipleChoiceItems = this.filterMultipleChoiceItems(this._multipleChoiceItems);
      this.examCalculator.aggregateItemsByResponse(this.filteredMultipleChoiceItems);
    }
  }

  get exams() {
    return this._exams;
  }

  loading: boolean = false;
  choiceColumns: DynamicItemField[];

  private _multipleChoiceItems: AssessmentItem[];
  private filteredMultipleChoiceItems: AssessmentItem[];
  private _exams: Exam[];

  constructor(private examCalculator: ExamStatisticsCalculator, private renderer: Renderer2, private angulartics2: Angulartics2) {
  }

  ngOnInit() {
    this.loading = true;
    this.assessmentProvider.getAssessmentItems(this.assessment.id, true).subscribe(assessmentItems => {

      let numOfScores = assessmentItems.reduce((x, y) => x + y.scores.length, 0);

      if (numOfScores != 0) {
        this._multipleChoiceItems = assessmentItems;
        this.choiceColumns = this.examCalculator.getChoiceFields(assessmentItems);

        this.filteredMultipleChoiceItems = this.filterMultipleChoiceItems(assessmentItems);
        this.examCalculator.aggregateItemsByResponse(this.filteredMultipleChoiceItems);
      }

      this.loading = false
    });
  }

  exportDistractorAnalysis(): void {
    let exportRequest = new ExportRequest();
    exportRequest.assessment = this.assessment;
    exportRequest.showAsPercent = this.showValuesAsPercent;
    exportRequest.assessmentItems = this.filteredMultipleChoiceItems;
    exportRequest.pointColumns = this.choiceColumns;
    exportRequest.type = RequestType.DistractorAnalysis;


    this.angulartics2.eventTrack.next({
      action: 'Export DistractorAnalysis',
      properties: {
        category: 'Export'
      }
    });

    this.assessmentProvider.exportItemsToCsv(exportRequest);
  }

  getChoiceRowStyleClass(index: number) {
    return index == 0
      ? 'level-down'
      : '';
  }

  // Unfortunately, this is a bit of dom hijacking to set the parent <td> class to green
  // since primeng datatable does not currently support a setCellStyle function.
  // https://github.com/primefaces/primeng/issues/2157
  setTdClass(cell, item: AssessmentItem, column: DynamicItemField) {
    if (item.answerKey && item.answerKey.indexOf(column.label) !== -1) {
      let td = cell.parentNode.parentNode;
      this.renderer.addClass(td, "green");
    }
  }

  private filterMultipleChoiceItems(items: AssessmentItem[]) {
    let filtered = [];

    for (let item of items) {
      let filteredItem = Object.assign(new AssessmentItem(), item);
      filteredItem.scores = item.scores.filter(score => this._exams.some(exam => exam.id == score.examId));
      filtered.push(filteredItem);
    }

    return filtered;
  }
}
