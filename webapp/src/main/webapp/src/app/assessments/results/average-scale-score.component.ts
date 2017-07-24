import { Component, Input, OnInit } from "@angular/core";
import { AssessmentExam } from "../model/assessment-exam.model";
import { ExamStatistics, ExamStatisticsLevel } from "../model/exam-statistics.model";
import { ScaleScoreService } from "../../shared/scale-score.service";

/**
 * This component is responsible for displaying the average scale score visualization
 */
@Component({
  selector: 'average-scale-score',
  templateUrl: './average-scale-score.component.html',
})
export class AverageScaleScoreComponent {
  iabColors: string[] = [
    'blue-dark',
    'blue-dark aqua',
    'aqua'
  ];

  icaSummativeColors: string[] = [
    'maroon',
    'gray-darkest',
    'green-dark',
    'blue-dark'
  ];

  levelPercents: any[];

  @Input()
  showValuesAsPercent: boolean = true;

  @Input()
  public assessmentExam: AssessmentExam;

  @Input()
  public statistics: ExamStatistics;

  constructor(private scaleScoreService: ScaleScoreService) {

  }

  ngOnInit(): void {
    if (this.statistics) {
      this.levelPercents = this.scaleScoreService.calculateDisplayScoreDistribution(this.statistics.percents);
    }
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

  get scaleScoreColor(): string {
    let level = this.scaleScoreService.calculateLevelNumber(this.assessmentExam.assessment, this.statistics.average, this.statistics.standardError);

    return this.assessmentExam.assessment.isIab
      ? this.iabColors[ level-1 ]
      : this.icaSummativeColors[ level-1 ];
  }
}
