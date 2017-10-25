import { Component, Input, OnInit } from '@angular/core';
import { AssessmentItem } from "../../../model/assessment-item.model";
import { Exam } from "../../../model/exam.model";
import { DyanamicItemField } from "../../../model/item-point-field.model";
import { ExamStatisticsCalculator } from "../../exam-statistics-calculator";
import { AssessmentProvider } from "../../../assessment-provider.interface";
import { Assessment } from "../../../model/assessment.model";

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
  choiceColumns: DyanamicItemField[];

  private _multipleChoiceItems: AssessmentItem[];
  private filteredMultipleChoiceItems: AssessmentItem[];
  private _exams: Exam[];

  constructor(private examCalculator: ExamStatisticsCalculator) {
  }

  ngOnInit() {
    this.loading = true;
    this.assessmentProvider.getAssessmentItems(this.assessment.id).subscribe(assessmentItems => {
      let multipleChoiceItems = assessmentItems.filter(x => x.isMultipleChoice);
      let numOfScores = multipleChoiceItems.reduce((x, y) => x + y.scores.length, 0);

      if (numOfScores != 0) {
        this._multipleChoiceItems = multipleChoiceItems;
        this.choiceColumns = this.examCalculator.getChoiceFields(multipleChoiceItems);

        this.filteredMultipleChoiceItems = this.filterMultipleChoiceItems(multipleChoiceItems);
        this.examCalculator.aggregateItemsByResponse(this.filteredMultipleChoiceItems);
      }

      this.loading = false
    });
  }

  exportDistractorAnalysis(): void {
    // TODO: DWR-1070
  }

  getChoiceRowStyleClass(index: number) {
    return index == 0 ? 'level-down' : '';
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
