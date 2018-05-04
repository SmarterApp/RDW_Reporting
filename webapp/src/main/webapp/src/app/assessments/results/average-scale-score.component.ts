import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AssessmentExam } from "../model/assessment-exam.model";
import { ExamStatistics, ExamStatisticsLevel } from "../model/exam-statistics.model";
import { InstructionalResource } from "../model/instructional-resources.model";
import { InstructionalResourcesService } from "./instructional-resources.service";
import { ColorService } from "../../shared/color.service";
import { AssessmentProvider } from "../assessment-provider.interface";
import { Observable } from "rxjs/Observable";
import { TranslateService } from "@ngx-translate/core";
import { ClaimStatistics } from '../model/claim-score.model';
import { ExamStatisticsCalculator } from './exam-statistics-calculator';

enum ScoreViewState {
  OVERALL = 1,
  CLAIM = 2
}

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
    // reverse percents and levels so scale score statistics appear in descending order ("good" statistics levels comes before "bad")
    value.percents = value.percents.reverse();
    value.levels = value.levels.reverse();
    this._statistics = value;
    if (!value) {
      return;
    }

    if (!isNaN(value.average)) {
      this.averageScore = Math.round(value.average);
    }

    if (value.levels) {
      this._totalCount = value.levels
        .map(examStatisticsLevel => examStatisticsLevel.value)
        .reduce((total, levelCount) => {
          return total + levelCount;
        });
    }

    // pre-calculates the data widths for the graph representation for all of the claims
    this._claimDataWidths = value.claims.map(claimStatistics =>
      this.examCalculator.getDataWidths(claimStatistics.percents.map(percent => percent.value))
    );
  }

  @Input()
  assessmentProvider: AssessmentProvider;

  @Output()
  onScoreViewToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  instructionalResourcesProvider: () => Observable<InstructionalResource[]>;

  averageScore: number;
  displayState: any = {
    showClaim: ScoreViewState.OVERALL
  };

  private _statistics: ExamStatistics;
  private _totalCount: number;
  private _claimDataWidths: Array<number[]>;

  constructor(public colorService: ColorService,
              private instructionalResourcesService: InstructionalResourcesService,
              private translate: TranslateService,
              private examCalculator: ExamStatisticsCalculator) {
  }

  get statistics(): ExamStatistics {
    return this._statistics;
  }

  get claimCodes(): string[] {
    return this.assessmentExam.assessment.claimCodes;
  }

  getClaimDataWidth(claimIndex: number, levelIndex: number): number {
    return this._claimDataWidths[claimIndex][levelIndex];
  }

  getClaimValue(claimStats: ClaimStatistics, index: number): number {
    return this.showValuesAsPercent ? Math.round(claimStats.percents[index].value) : claimStats.levels[index].value;
  }

  getClaimSuffix(claimStats: ClaimStatistics, index: number): string {
    return this.showValuesAsPercent ? claimStats.percents[index].suffix : claimStats.levels[index].suffix;
  }

  get isClaimScoreSelected(): boolean {
    return this.displayState.table == ScoreViewState.CLAIM;
  }

  public setClaimScoreSelected(): void {
    this.displayState.table = ScoreViewState.CLAIM;
    this.onScoreViewToggle.emit(true);
  }

  public setOverallScoreSelected(): void {
    this.displayState.table = ScoreViewState.OVERALL;
    this.onScoreViewToggle.emit(false);
  }

  get showClaimToggle(): boolean {
    return !this.assessmentExam.assessment.isIab;
  }

  get hasAverageScore(): boolean {
    return !isNaN(this.averageScore);
  }

  get performanceLevels(): ExamStatisticsLevel[] {
    return this.showValuesAsPercent ? this.statistics.percents : this.statistics.levels;
  }

  /**
   * Calculates the amount of the bar filled by the ExamStatisticsLevel
   * @param {ExamStatisticsLevel} examStatisticsLevel
   * @returns {number} the amount filled by the examStatisticsLevel (0-100)
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

  examLevelTranslation(performanceLevel: ExamStatisticsLevel): string {
    return this.translate.instant(performanceLevel.id ? `common.assessment-type.${this.assessmentExam.assessment.type}.performance-level.${performanceLevel.id}.short-name` : 'common.missing')
  }

  private levelCountPercent(levelCount: number): number {
    return Math.floor(levelCount / this._totalCount * 100);
  }

  loadInstructionalResources(performanceLevel: ExamStatisticsLevel) {
    this.instructionalResourcesProvider = () => this.instructionalResourcesService.getInstructionalResources(this.assessmentExam.assessment.id, this.assessmentProvider.getSchoolId())
      .map(resources => resources.getResourcesByPerformance(performanceLevel.id));
  }
}
