import { Component, Input } from "@angular/core";
import { AssessmentExam } from "../model/assessment-exam.model";
import { ExamStatistics, ExamStatisticsLevel } from "../model/exam-statistics.model";
import { ScaleScoreService } from "./scale-score.service";
import { AssessmentResultsComponent } from "./assessment-results.component";

const icaColors =  ['maroon', 'gray-darkest', 'green-dark', 'blue-dark'];
const iabColors = ['blue-dark', 'blue-dark aqua', 'aqua'];
/**
 * This component is responsible for displaying the average scale score visualization
 */
@Component({
  selector: 'average-scale-score',
  templateUrl: './average-scale-score.component.html',
})
export class AverageScaleScoreComponent {

  levelPercents: any[];

  count = 0;
  private _statistics: ExamStatistics;

  @Input()
  showValuesAsPercent: boolean = true;

  @Input()
  public assessmentExam: AssessmentExam;

  @Input()
  set statistics(value: ExamStatistics) {
    this._statistics = value;

    if (this._statistics) {
      this.levelPercents = this.scaleScoreService.calculateDisplayScoreDistribution(this._statistics.percents);
    }
  }

  get statistics(): ExamStatistics {
    return this._statistics;
  }

  constructor(private scaleScoreService: ScaleScoreService, private assessmentResultsComponent: AssessmentResultsComponent) {

  }

  get hasAverageScore(): boolean {
    return !isNaN(this.statistics.average);
  }

  get showIab(): boolean {
    return this.assessmentExam.assessment.isIab && this.statistics && this.statistics.total > 0;
  }

  get showIcaSummative(): boolean {
    return !this.assessmentExam.assessment.isIab && this.statistics && this.statistics.total > 0;
  }

  get examLevelEnum() {
    return this.assessmentExam.assessment.isIab
      ? "enum.iab-category.short."
      : "enum.achievement-level.short.";
  }

  get performanceLevels(): ExamStatisticsLevel[] {
    if (this.showValuesAsPercent)
      return this.statistics.percents;
    else
      return this.statistics.levels;
  }

  getLevelPercent(num: number): number {
    return this.levelPercents[num];
  }

  floor(num: number): number {
    return Math.floor(num);
  }

  getIcaColor(index: number) {
    return icaColors[index];
  }

  getIabColor(index: number) {
    return iabColors[index];
  }
}
