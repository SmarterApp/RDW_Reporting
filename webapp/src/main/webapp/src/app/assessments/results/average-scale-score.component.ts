import { Component, Input } from "@angular/core";
import { AssessmentExam } from "../model/assessment-exam.model";
import { ExamStatistics, ExamStatisticsLevel } from "../model/exam-statistics.model";
import { ScaleScoreService } from "./scale-score.service";
import { InstructionalResource, InstructionalResources } from "../model/instructional-resources.model";
import { InstructionalResourcesService } from "./instructional-resources.service";
import { GroupAssessmentService } from "../../groups/results/group-assessment.service";
import { ColorService } from "../../shared/color.service";

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

  instructionalResources: InstructionalResource[];

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

  constructor(public colorService: ColorService,
              private scaleScoreService: ScaleScoreService,
              private instructionalResourcesService: InstructionalResourcesService,
              private assessmentProvider: GroupAssessmentService) {
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

  levelSum(): number {
    const values = this.statistics.levels.map(l => l.value);
    return Math.max(values.reduce((p, c) => p + c), 10);
  }

  filledLevel(examStatisticsLevel: ExamStatisticsLevel): number {
    if (this.showValuesAsPercent)
      return this.floor(examStatisticsLevel.value);
    return this.floor(examStatisticsLevel.value * this.levelSum());
  }

  unfilledLevel(examStatisticsLevel: ExamStatisticsLevel): number {
    if (this.showValuesAsPercent)
      return 100 - this.floor(examStatisticsLevel.value);
    return 100 - this.floor(examStatisticsLevel.value * this.levelSum());
  }

  floor(num: number): number {
    return Math.floor(num);
  }

  loadInstructionalResources(performanceLevel: ExamStatisticsLevel) {
    this.instructionalResourcesService.getInstructionalResources(this.assessmentExam.assessment.id, this.assessmentProvider.getSchoolId()).subscribe((instructionalResources: InstructionalResources) => {
      this.instructionalResources = instructionalResources.getResourcesByPerformance(performanceLevel.id);
    });
  }

}
