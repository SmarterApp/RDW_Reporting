import { Component, Input, OnInit } from "@angular/core";
import { AssessmentType } from "../../shared/enum/assessment-type.enum";
import { ColorService } from "../../shared/color.service";

/**
 * This component displays a horizontal performance-level population bar chart.
 * If there is a positive {@link #performanceRollup} value supplied, the chart is
 * anchored in the middle between the performanceRollup-1 and performanceRollup value.
 */
@Component({
  selector: 'performance-comparison',
  templateUrl: './performance-comparison.component.html',
})
export class PerformanceComparisonComponent implements OnInit {

  @Input()
  public assessmentType: AssessmentType;

  /**
   * The rollup performance level (1-based)
   */
  @Input()
  public performanceRollup: number;

  /**
   * The performance level count percentages (0-based)
   */
  @Input()
  public performancePercentages: number[];

  @Input()
  public groupPerformanceLevels: boolean;

  private belowPercentages: number[];
  private abovePercentages: number[];

  constructor(public colorService: ColorService) {}

  public ngOnInit(): void {
    this.belowPercentages = this.hasRollup()
      ? this.performancePercentages.slice(0, this.performanceRollup-1)
      : this.performancePercentages;
    this.abovePercentages = this.hasRollup()
      ? this.performancePercentages.slice(this.performanceRollup-1)
      : [];
  }

  public hasRollup(): boolean {
    return this.performanceRollup > 0;
  }

  public getBelowPercentages(): number[] {
    return this.groupPerformanceLevels
      ? [this.belowPercentages.reduce((total, level) => total + level)]
      : this.belowPercentages;
  }

  public getAbovePercentages(): number[] {
    return this.groupPerformanceLevels
      ? [this.abovePercentages.reduce((total, level) => total + level)]
      : this.abovePercentages;
  }

  public getBelowColor(level: number): string {
    return this.getColor(level);
  }

  public getAboveColor(level: number): string {
    return this.getColor(this.getBelowPercentages().length + level);
  }

  private getColor(level: number): string {
    let effectiveLevel = this.groupPerformanceLevels
      ? level == 0 ? this.performanceRollup - 2 : this.performanceRollup - 1
      : level;
    return this.colorService.getPerformanceLevelColor({type: this.assessmentType} as any, effectiveLevel);
  }

}
