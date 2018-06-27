import { Component, Input, OnInit } from '@angular/core';
import { AssessmentItem } from "../../../model/assessment-item.model";
import { ExportItemsRequest } from "../../../model/export-items-request.model";
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

  columns: Column[];
  loading: boolean = true;
  filteredAssessmentItems: AssessmentItem[];

  private _assessmentItems: AssessmentItem[];
  private _exams: Exam[];
  private _pointColumns: DynamicItemField[] = [];

  constructor(private examCalculator: ExamStatisticsCalculator) {
  }

  ngOnInit() {
    this.assessmentProvider.getAssessmentItems(this.assessment.id).subscribe(assessmentItems => {

      const numOfScores = assessmentItems.reduce((x, y) => x + y.scores.length, 0);

      if (numOfScores !== 0) {
        // todo: move?
        this._pointColumns = this.examCalculator.getPointFields(assessmentItems);

        this._assessmentItems = assessmentItems;
        this.filteredAssessmentItems = this.filterAssessmentItems(assessmentItems);

        this.examCalculator.aggregateItemsByPoints(this.filteredAssessmentItems);
      }

      this.columns = [
        new Column({id: 'number', field: 'position'}),
        new Column({id: 'claim', field: 'claimTarget', headerInfo: true}),
        new Column({id: 'difficulty', sortField: 'difficultySortOrder', headerInfo: true}),
        new Column({id: 'standard', field: 'commonCoreStandardIds', headerInfo: true}),
        new Column({id: 'full-credit', field: 'fullCredit', styleClass: 'level-up', headerInfo: true}),
        ...this._pointColumns.map(this.toColumn)
      ];

      this.loading = false;
    });
  }

  hasDataToExport(): boolean {
    return this.filteredAssessmentItems && this.filteredAssessmentItems.length > 0;
  }

  exportToCsv(): void {
    const request = new ExportItemsRequest();
    request.assessment = this.assessment;
    request.assessmentItems = this.filteredAssessmentItems;
    request.pointColumns = this._pointColumns;
    request.showAsPercent = this.showValuesAsPercent;
    request.type = RequestType.ResultsByItems;
    this.assessmentExporter.exportItemsToCsv(request);
  }

  private filterAssessmentItems(assessmentItems: AssessmentItem[]): AssessmentItem[] {
    const filtered = [];

    for (const assessmentItem of assessmentItems) {
      const filteredItem = Object.assign(new AssessmentItem(), assessmentItem);
      filteredItem.scores = assessmentItem.scores.filter(score =>
        this._exams.some(exam => exam.id === score.examId));
      filtered.push(filteredItem);
    }

    return filtered;
  }

  private toColumn(pointColumn: DynamicItemField, index: number): Column {
    return new Column({
      id: 'point',
      label: pointColumn.label,
      field: pointColumn.numberField,
      styleClass:  index === 0 ? 'level-down' : '',
      numberField: pointColumn.numberField,
      percentField: pointColumn.percentField
    });
  }
}

class Column {
  id: string;
  field: string;
  sortField: string;
  headerInfo: boolean;
  styleClass: string;

  //Point column properties
  label?: string;
  numberField?: string;
  percentField?: string;

  constructor({
                id,
                field = '',
                sortField = '',
                headerInfo = false,
                styleClass = '',
                label = '',
                numberField = '',
                percentField = ''
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
