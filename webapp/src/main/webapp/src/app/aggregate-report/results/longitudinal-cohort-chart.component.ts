import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SchoolYearPipe } from '../../shared/format/school-year.pipe';
import * as d3 from 'd3';
import {
  LongitudinalCohortChart,
  NumberRange,
  OrganizationPerformance,
  PerformanceLevel,
  YearGrade
} from './longitudinal-cohort-chart';
import { byNumber } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { Organization } from '../../shared/organization/organization';


/**
 * Represents the display configuration parameters
 */
export interface ChartDisplay {
  readonly outerWidth: number;
  readonly outerHeight: number;
  readonly margin: Spacing;
  readonly padding: Spacing;
  readonly domainMargin: Spacing;
  readonly tickPadding: number;
}

/**
 * The chart's view model. This model carries the chart data pre-processed for display
 */
interface ChartView {
  readonly performancePaths: PerformancePath[];
  readonly performanceLevelPaths: PerformanceLevelPath[];
  readonly performanceLevelPathLabels: PerformanceLevelPathLabel[];
}

export interface Spacing {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

interface Path {
  readonly styles?: any;
  readonly pathData: string;
}

interface DiscretePath<T extends Point> extends Path {
  readonly points: T[];
}

interface Point {
  readonly styles?: any;
  readonly x: number;
  readonly y: number;
}

interface PerformancePath extends DiscretePath<PerformancePoint> {
  readonly organization: Organization;
  readonly subgroup: any;
  fade: boolean;
}

interface PerformancePoint extends Point {
  readonly levelRange: LevelRange;
  readonly scaleScore: number;
  readonly standardError: number;
}

interface PerformanceLevelPath extends Path {
  readonly performanceLevel: PerformanceLevel;
  readonly dividerPathData: string;
}

interface PerformanceLevelPathLabel {
  readonly text: string;
  readonly margin: Spacing;
  readonly y: number;
  readonly height: number;
  readonly pathData: string;
  readonly styles?: any;
}

interface LevelRange {
  readonly level: PerformanceLevel;
  readonly scaleScoreRange: NumberRange;
}

@Component({
  selector: 'longitudinal-cohort-chart',
  templateUrl: 'longitudinal-cohort-chart.component.html'
})
export class LongitudinalCohortChartComponent implements OnInit {

  @Input()
  linePallet: string = 'pallet-a';

  @Input()
  areaPallet: string = 'pallet-b';

  private previousPoint: { path: PerformancePath, point: PerformancePoint };
  private _initialized: boolean = false;
  private _chart: LongitudinalCohortChart;
  private _chartView: ChartView;
  private _display: ChartDisplay = {
    outerWidth: 960,
    outerHeight: 480,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    padding: { top: 0, right: 200, bottom: 40, left: 40 },
    domainMargin: { top: 25, right: 0.25, bottom: 25, left: 0.25 },
    tickPadding: 10
  };

  private _selectedPaths: Set<number> = new Set();

  constructor(private elementReference: ElementRef,
              private translate: TranslateService,
              private schoolYearPipe: SchoolYearPipe) {
  }

  get chart(): LongitudinalCohortChart {
    return this._chart;
  }

  @Input()
  set chart(value: LongitudinalCohortChart) {
    if (this._chart !== value) {
      this._chart = value;
      if (this._initialized) {
        this.render();
      }
    }
  }

  get display(): ChartDisplay {
    return this._display;
  }

  @Input()
  set display(value: ChartDisplay) {
    if (this._display !== value) {
      this._display = value;
      if (this._initialized) {
        this.render();
      }
    }
  }

  get chartView(): ChartView {
    return this._chartView;
  }

  ngOnInit(): void {
    this.render();
    this._initialized = true;
  }

  onChartSeriesToggleClick(path: PerformancePath, pathIndex: number): void {
    this._selectedPaths.has(pathIndex)
      ? this._selectedPaths.delete(pathIndex)
      : this._selectedPaths.add(pathIndex);

    this._chartView.performancePaths
      .forEach((path, index) => path.fade = this._selectedPaths.size !== 0 && !this._selectedPaths.has(index));
    this.previousPoint = null;
  }

  toggleFadeOnPoint(path: PerformancePath, point: PerformancePoint): void {
    if (this.previousPoint && this.previousPoint.path === path) {
      // do nothing...same line
      return;
    }
    this.previousPoint = { path, point };
    for (const performancePath of this.chartView.performancePaths) {
      if (performancePath !== path) {
        performancePath.fade = !performancePath.fade;
      } else {
        performancePath.fade = false;
      }
    }
  }

  private render(): void {

    if (this.chart == null
      || this.display == null) {
      return;
    }

    const scaleScoreRange = this.parseScaleScoreRange(this.chart.performanceLevels);
    const yearGrades = this.parseYearGrades(this.chart.organizationPerformances);

    const {
      outerWidth,
      outerHeight,
      tickPadding,
      margin,
      padding,
      domainMargin
    } = this.display;

    const
      innerWidth = outerWidth - margin.left - margin.right,
      innerHeight = outerHeight - margin.top - margin.bottom,
      width = innerWidth - padding.left - padding.right - tickPadding,
      height = innerHeight - padding.top - padding.bottom - tickPadding;

    const xScale = d3.scaleLinear()
      .range([ 0, width ])
      .domain([ -domainMargin.left, yearGrades.length - 1 + domainMargin.right ]);

    const yScale = d3.scaleLinear()
      .range([ height, 0 ])
      .domain([ scaleScoreRange.minimum - domainMargin.bottom, scaleScoreRange.maximum + domainMargin.top ]);

    const d3area = d3.area<any>()
      .x(({ x }) => xScale(x))
      .y0(({ y0 }) => yScale(y0))
      .y1(({ y1 }) => yScale(y1));

    const d3line = d3.line<any>()
      .x(({ x }) => xScale(x))
      .y(({ y }) => yScale(y));

    const d3lineNoScale = d3.line<any>()
      .x(({ x }) => x)
      .y(({ y }) => y);

    const levelRangesByYearGradeIndex: LevelRange[][] = [];
    this._chart.performanceLevels.forEach((level, i) => {
      level.yearGradeScaleScoreRanges.forEach(({ yearGrade, scaleScoreRange }, j) => {
        const levelRanges = levelRangesByYearGradeIndex[ j ] = levelRangesByYearGradeIndex[ j ] || [];
        levelRanges.push(<LevelRange>{
          level: level,
          scaleScoreRange: scaleScoreRange
        });
      });
    });

    const findPerformanceLevelRange = (levelRangesByYearGradeIndex: LevelRange[][], yearGradeIndex: number, scaleScore: number): LevelRange => {
      return levelRangesByYearGradeIndex[ yearGradeIndex ].find(levelRange =>
        levelRange.scaleScoreRange.minimum <= scaleScore
        && levelRange.scaleScoreRange.maximum > scaleScore
      );
    };

    this._chartView = <ChartView>{
      performancePaths: this._chart.organizationPerformances
        .map((performance, i) => <PerformancePath>{
          styles: `scale-score-line color-${i % 3} series-${i}`,
          fade: false,
          pathData: d3line(performance.yearGradeScaleScores.map(({ scaleScore }, j) => <any>{
            x: j,
            y: scaleScore
          })),
          points: performance.yearGradeScaleScores.reduce((points, { scaleScore, standardError }, j) => {
            if (scaleScore != null) {
              points.push(<PerformancePoint>{
                styles: `point color-stroke`,
                x: xScale(j),
                y: yScale(scaleScore),
                scaleScore: scaleScore,
                standardError: standardError,
                levelRange: findPerformanceLevelRange(levelRangesByYearGradeIndex, j, scaleScore)
              });
            }
            return points;
          }, []),
          organization: performance.organization,
          subgroup: performance.subgroup
        }),
      performanceLevelPaths: this._chart.performanceLevels.map((level, i) => <PerformanceLevelPath>{
        styles: `scale-score-area color-${i % 4}`,
        pathData: d3area(level.yearGradeScaleScoreRanges.map(({ scaleScoreRange }, j) => <any>{
          x: j,
          y0: scaleScoreRange.minimum,
          y1: scaleScoreRange.maximum
        })),
        dividerPathData: d3line(level.yearGradeScaleScoreRanges.map(({ scaleScoreRange }, j) => <any>{
          x: j,
          y: scaleScoreRange.maximum
        })),
        performanceLevel: level
      }),
      performanceLevelPathLabels: levelRangesByYearGradeIndex[ levelRangesByYearGradeIndex.length - 1 ].map(levelRange => {
        const height = yScale(levelRange.scaleScoreRange.maximum) - yScale(levelRange.scaleScoreRange.minimum);
        const margin = { left: 5, top: -2, right: 0, bottom: 2 };
        return <PerformanceLevelPathLabel>{
          text: levelRange.level.namePrefix,
          styles: ``,
          margin: margin,
          y: yScale(levelRange.scaleScoreRange.minimum),
          height: height,
          pathData: d3lineNoScale([
            { x: 0, y: margin.top },
            { x: margin.left, y: margin.top },
            { x: margin.left, y: height + margin.bottom },
            { x: 0, y: height + margin.bottom }
          ])
        };
      })
    };

    // Create axes

    const xAxis = d3.axisBottom(xScale)
      .tickSize(-height)
      .tickPadding(tickPadding)
      .ticks(yearGrades.length)
      .tickValues(yearGrades.map((d, i) => i))
      .tickFormat((d, i) => this.schoolYearPipe.transform(yearGrades[ i ].year));

    const yAxis = d3.axisLeft(yScale)
      .tickSize(-width)
      .tickPadding(tickPadding)
      .tickFormat(d => d);

    // Clear previous axes drawings

    this.axesContainer.selectAll('*').remove();

    // Draw axes

    this.axesContainer.append('g')
      .classed('x axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    this.axesContainer.append('g')
      .classed('y axis', true)
      .call(yAxis);

    // Correct x axis labels

    this.axesContainer.selectAll('.axis.x .tick')
      .append('text')
      .text((d, i) => {
        const grade = yearGrades[ i ].grade.toString();
        const gradeCode = grade.length < 2 ? '0' + grade : grade;
        return this.translate.instant(`common.assessment-grade-label.${gradeCode}`);
      })
      .classed('grade', true)
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'middle');

    // Draw second y axis

    const bands = this.axesContainer.append('g')
      .classed(`scale-score-area-labels ${this.areaPallet}`, true)
      .attr('transform', `translate(${width}, 0)`);

    const bandData = this._chartView.performanceLevelPathLabels;

    const band = bands.selectAll('.scale-score-area-label')
      .data(bandData)
      .enter()
      .append('g')
      .attr('transform', d => `translate(0, ${d.y})`)
      .attr('class', (d, i) => `scale-score-area-label color-${i}`);

    const bandTitle = band
      .filter((d, i) => i === bandData.length - 1)
      .append('g')
      .classed('scale-score-area-labels-description', true);

    const title1 = bandTitle.append('text')
      .classed('strong', true)
      .text(this.translate.instant('longitudinal-cohort-chart.area-description.text'));

    const title2 = bandTitle.append('text')
      .text(this.translate.instant('longitudinal-cohort-chart.area-description.subtext'));

    const title1Bounds = title1.node().getBBox();
    title2.attr('transform', `translate(0, ${title1Bounds.height})`);

    const bandTitleBounds = bandTitle.node().getBBox();
    // 0.33 is a magic number, should be 0 with alignment-baseline hanging...
    bandTitle.attr('transform', d => `translate(${d.margin.left * 2}, ${d.height + bandTitleBounds.height * 0.33})`);

    band.append('path')
      .classed('bracket color-stroke', true)
      .attr('d', d => d.pathData);

    const label = band.append('g')
      .classed('label-container', true)
      .attr('transform', d => `translate(${d.margin.left}, ${d.height * 0.5})`);

    const labelPadding = { top: 3, right: 5, bottom: 3, left: 3 };
    const labelBorderRadius = (labelPadding.top + labelPadding.left) * 0.25; // proportional to height and width

    const labelRect = label.append('rect')
      .classed('color-fill', true)
      .attr('rx', labelBorderRadius)
      .attr('ry', labelBorderRadius);

    const labelText = label.append('text')
      .classed('label-text', true)
      .text((d, i) => d.text);

    const labelTextBounds = labelText._groups[ 0 ].map(a => a.getBBox());
    // 0.33 is a magic number, translate y should be 0 with alignment middle...
    labelText.attr('transform', (d, i) => `translate(${labelPadding.left}, ${labelTextBounds[ i ].height * 0.33})`);

    labelRect.attr('y', (d, i) => -(labelTextBounds[ i ].height + labelPadding.top + labelPadding.bottom) * 0.5)
      .attr('width', (d, i) => labelTextBounds[ i ].width + labelPadding.left + labelPadding.right)
      .attr('height', (d, i) => labelTextBounds[ i ].height + labelPadding.top + labelPadding.bottom);
  }

  private get axesContainer(): any {
    return <any>d3.select(
      this.elementReference.nativeElement.querySelector('.axes-container')
    );
  }

  /**
   * Computes the overall scale score range for a given set of performance level cut points
   *
   * @param {PerformanceLevel[]} performanceLevels
   * @returns {NumberRange}
   */
  private parseScaleScoreRange(performanceLevels: PerformanceLevel[]): NumberRange {
    return performanceLevels.reduce((range, level) => {
      level.yearGradeScaleScoreRanges.forEach(({ scaleScoreRange }) => {
        if (scaleScoreRange.maximum > range.maximum) {
          range.maximum = scaleScoreRange.maximum;
        }
        if (scaleScoreRange.minimum < range.minimum) {
          range.minimum = scaleScoreRange.minimum;
        }
      });
      return range;
    }, {
      minimum: Number.MAX_SAFE_INTEGER,
      maximum: Number.MIN_SAFE_INTEGER
    });
  }

  /**
   * Computes the all year-grade pairs for the given organization performances
   *
   * @param {OrganizationPerformance[]} performances
   * @returns {YearGrade[]}
   */
  private parseYearGrades(performances: OrganizationPerformance[]): YearGrade[] {
    const yearGrades: YearGrade[] = [];
    performances.forEach(({ yearGradeScaleScores }) => {
      yearGradeScaleScores.forEach(({ yearGrade }) => {
        if (yearGrades.find(({ year }) => year === yearGrade.year) == null) {
          yearGrades.push(yearGrade);
        }
      });
    });
    return yearGrades.sort(ordering(byNumber).on((yearGrade: YearGrade) => yearGrade.year).compare);
  }

}
