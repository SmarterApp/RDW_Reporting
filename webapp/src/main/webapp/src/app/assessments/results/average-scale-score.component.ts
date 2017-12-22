import { Component, Input } from "@angular/core";
import { AssessmentExam } from "../model/assessment-exam.model";
import { ExamStatistics, ExamStatisticsLevel } from "../model/exam-statistics.model";
import { InstructionalResource } from "../model/instructional-resources.model";
import { InstructionalResourcesService } from "./instructional-resources.service";
import { ColorService } from "../../shared/color.service";
import { AssessmentProvider } from "../assessment-provider.interface";
import { Observable } from "rxjs/Observable";

/**
 * This component is responsible for displaying the average scale score visualization
 */
@Component({
  selector: 'average-scale-score',
  templateUrl: './average-scale-score.component.html',
})
export class AverageScaleScoreComponent {

  @Input()
  showValuesAsPercent: boolean = true;

  @Input()
  public assessmentExam: AssessmentExam;

  @Input()
  set statistics(value: ExamStatistics) {
    this._statistics = value;

    if (value && value.levels) {
      this._totalCount = value.levels
        .map(examStatisticsLevel => examStatisticsLevel.value)
        .reduce((total, levelCount) => {
          return total + levelCount;
        });
    }
  }

  @Input()
  assessmentProvider: AssessmentProvider;

  get statistics(): ExamStatistics {
    return this._statistics;
  }

  instructionalResourcesProvider: () => Observable<InstructionalResource[]>;

  private _statistics: ExamStatistics;
  private _totalCount: number;

  constructor(public colorService: ColorService,
              private instructionalResourcesService: InstructionalResourcesService) {
  }

  get hasAverageScore(): boolean {
    return !isNaN(this.statistics.average);
  }

  get examLevelEnum() {
    return this.assessmentExam.assessment.isIab
      ? "enum.iab-category.short."
      : "enum.achievement-level.short.";
  }

  get performanceLevels(): ExamStatisticsLevel[] {
    return this.showValuesAsPercent ? this.statistics.percents : this.statistics.levels;
  }

  /**
   * Calculates the amount of the bar filled by the ExamStatisticsLevel
   * @param {ExamStatisticsLevel} examStatisticsLevel
   * @returns {number} the amount filled by the examStatisticsLevel (0-100).
   */
  filledLevel(examStatisticsLevel: ExamStatisticsLevel): number {
    return this.showValuesAsPercent ? Math.floor(examStatisticsLevel.value) : this.levelCountPercent(examStatisticsLevel.value);
  }

  /**
   * Calculates the amount of the bar unfilled by the ExamStatisticsLevel
   * @param {ExamStatisticsLevel} examStatisticsLevel
   * @returns {number} the amount unfilled by the examStatisticsLevel (0-100)
   */
  unfilledLevel(examStatisticsLevel: ExamStatisticsLevel): number {
    return 100 - this.filledLevel(examStatisticsLevel);
  }

  private levelCountPercent(levelCount: number): number {
    return Math.floor(levelCount / this._totalCount * 100);
  }

  loadInstructionalResources(performanceLevel: ExamStatisticsLevel) {
    this.instructionalResourcesProvider = () => this.instructionalResourcesService.getInstructionalResources(this.assessmentExam.assessment.id, this.assessmentProvider.getSchoolId())
        .map(resources => resources.getResourcesByPerformance(performanceLevel.id));
  }

}
