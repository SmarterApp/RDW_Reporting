import { Component, Input, OnInit } from '@angular/core';
import { AssessmentItem } from "../../../model/assessment-item.model";
import { Exam } from "../../../model/exam.model";
import { DynamicItemField } from "../../../model/item-point-field.model";
import { ExamStatisticsCalculator } from "../../exam-statistics-calculator";
import { AssessmentProvider } from "../../../assessment-provider.interface";
import { ExportItemsRequest } from "../../../model/export-items-request.model";
import { Assessment } from "../../../model/assessment.model";
import { RequestType } from "../../../../shared/enum/request-type.enum";
import { ExportResults } from "../../assessment-results.component";
import { AssessmentExporter } from "../../../assessment-exporter.interface";

@Component({
  selector: 'distractor-analysis',
  templateUrl: './distractor-analysis.component.html'
})
export class DistractorAnalysisComponent implements OnInit, ExportResults {
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

    if (this.filteredMultipleChoiceItems) {
      this.filteredMultipleChoiceItems = this.filterMultipleChoiceItems(this._multipleChoiceItems);
      this.examCalculator.aggregateItemsByResponse(this.filteredMultipleChoiceItems);
    }
  }

  get exams() {
    return this._exams;
  }

  loading: boolean = false;
  columns: Column[];

  private _multipleChoiceItems: AssessmentItem[];
  private filteredMultipleChoiceItems: AssessmentItem[];
  private _exams: Exam[];
  private _choiceColumns: DynamicItemField[];

  constructor(private examCalculator: ExamStatisticsCalculator) {
  }

  ngOnInit() {
    this.loading = true;
    this.assessmentProvider.getAssessmentItems(this.assessment.id, ['MC', 'MS']).subscribe(assessmentItems => {

      let numOfScores = assessmentItems.reduce((x, y) => x + y.scores.length, 0);

      if (numOfScores != 0) {
        this._multipleChoiceItems = assessmentItems;
        this._choiceColumns = this.examCalculator.getChoiceFields(assessmentItems);

        this.filteredMultipleChoiceItems = this.filterMultipleChoiceItems(assessmentItems);
        this.examCalculator.aggregateItemsByResponse(this.filteredMultipleChoiceItems);
      }

      this.columns = [
        new Column({id: "number", field: "position"}),
        new Column({id: "claim", field: "claimTarget", headerInfo: true}),
        new Column({id: "difficulty", sortField: "difficultySortOrder", headerInfo: true}),
        new Column({id: "standard", field: "commonCoreStandardIds", headerInfo: true}),
        new Column({id: "full-credit", field: "fullCredit", styleClass: "level-up", headerInfo: true}),
      ];
      if (this._choiceColumns) {
        this.columns.push(...this._choiceColumns.map(this.toColumn));
      }

      this.loading = false
    });
  }

  hasDataToExport(): boolean {
    return this.filteredMultipleChoiceItems && this.filteredMultipleChoiceItems.length > 0;
  }

  exportToCsv(): void {
    let exportRequest = new ExportItemsRequest();
    exportRequest.assessment = this.assessment;
    exportRequest.showAsPercent = this.showValuesAsPercent;
    exportRequest.assessmentItems = this.filteredMultipleChoiceItems;
    exportRequest.pointColumns = this._choiceColumns;
    exportRequest.type = RequestType.DistractorAnalysis;

    this.assessmentExporter.exportItemsToCsv(exportRequest);
  }

  isCorrect(item: AssessmentItem, label: string) {
    return item.answerKey && item.answerKey.indexOf(label) !== -1;
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

  private toColumn(choice: DynamicItemField, index: number): Column {
    return new Column({
      id: "choice",
      label: choice.label,
      field: choice.numberField,
      styleClass:  index == 0 ? 'level-down' : '',
      numberField: choice.numberField,
      percentField: choice.percentField
    });
  }
}

class Column {
  id: string;
  field: string;
  sortField: string;
  headerInfo: boolean;
  styleClass: string;

  //Choice column properties
  label?: string;
  numberField?: string;
  percentField?: string;

  constructor({
                id,
                field = "",
                sortField = "",
                headerInfo = false,
                styleClass = "",
                label = "",
                numberField = "",
                percentField = ""
              }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortField = sortField ? sortField : this.field;
    this.headerInfo = headerInfo;
    this.styleClass = styleClass;
    if (label) {
      this.label = label;
    }
    if (numberField) {
      this.numberField = numberField;
    }
    if (percentField) {
      this.percentField = percentField;
    }
  }
}
