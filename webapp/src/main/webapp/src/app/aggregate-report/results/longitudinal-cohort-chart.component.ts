import {
  Component,
  ElementRef,
  Input,
  OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DefaultSchool, Organization } from '../../shared/organization/organization';
import { SchoolYearPipe } from '../../shared/format/school-year.pipe';
import * as d3 from 'd3';

interface YearGrade {
  // TODO make this string code when data comes from backend
  readonly grade: number;
  readonly year: number;
}

interface Range<T> {
  readonly minimum: T;
  readonly maximum: T;
}

interface YearGradeScaleScore {
  readonly gradeYear: YearGrade;
  readonly scaleScore: number;
}

interface YearGradeScaleScoreRange {
  readonly gradeYear: YearGrade;
  readonly scaleScoreRange: Range<number>;
}

interface OrganizationPerformance {
  readonly organization: Organization;
  readonly gradeYearScaleScores: YearGradeScaleScore[];
}

interface PerformanceLevel {
  readonly id: number;
  readonly name: string;
}

interface AssessmentPerformance {
  readonly level: PerformanceLevel;
  readonly gradeYearScaleScoreRanges: YearGradeScaleScoreRange[];
}

interface Series<T> {
  readonly data: T;
  readonly styles?: any;
  readonly selector: string;
  visible: boolean;
}

interface ChartArea<T, U> {
  readonly points: ChartAreaPoint<U>[];
  readonly data: T;
  readonly styles?: any;
}

interface ChartAreaPoint<T> {
  readonly x: number;
  readonly y0: number;
  readonly y1: number;
}

interface ChartPoint<T> {
  readonly x: number;
  readonly y: number;
  readonly data: T;
  readonly styles?: any;
}

interface ChartLine<T, U> {
  readonly points: ChartPoint<U>[];
  readonly data?: T;
  readonly styles?: any;
}

interface DataPoint {
  readonly scaleScoreRange: Range<number>;
  readonly scaleScore: number;
}

interface LongitudinalCohortChart {
  readonly scaleScoreRange: Range<number>;
  readonly yearGrades: YearGrade[];
  readonly assessmentPerformances: ChartArea<PerformanceLevel, void>[];
  readonly organizationPerformances: Series<ChartLine<Organization, DataPoint>>[];
}

function createYearsAndGrades(first: YearGrade, count: number, step: number = 1, initialGap: number = 0) {
  const yearsAndGrades = [ first ];
  for (let i = 1 + initialGap; i < count; i++) {
    yearsAndGrades.push({
      year: first.year + i * step,
      grade: first.grade + i * step
    });
  }
  return yearsAndGrades;
}

function computeBands(areas: AssessmentPerformance[], xScale: (x: number) => number, yScale: (x: number) => number) {
  return areas
  // gets the rightmost entries of each area
    .map(area => area.gradeYearScaleScoreRanges[ area.gradeYearScaleScoreRanges.length - 1 ])
    .map(area => {
      const height = yScale(area.scaleScoreRange.maximum) - yScale(area.scaleScoreRange.minimum);
      // const h = Math.abs( yScale(area.scaleScoreRange.maximum) - yScale(area.scaleScoreRange.minimum) );
      const margin = { left: 5, top: -2, right: 0, bottom: 2 };

      return Object.assign({
        bracket: {
          y: area.scaleScoreRange.minimum,
          height: height,
          path: [
            { x: 0, y: margin.top },
            { x: margin.left, y: margin.top },
            { x: margin.left, y: height + margin.bottom },
            { x: 0, y: height + margin.bottom }
          ]
        }
      }, area);
    });
}

function createAreas(count: number, yearsAndGrades: YearGrade[], scaleScoreRange: number[]): AssessmentPerformance[] {
  const [ minimumScaleScore, maximumScaleScore ] = scaleScoreRange;
  const areas = [];
  for (let i = 0; i < count; i++) {
    const area = [];
    for (let j = 0; j < yearsAndGrades.length; j++) {

      const previous = areas[ i - 1 ] != null
      && areas[ i - 1 ].gradeYearScaleScoreRanges != null
      && areas[ i - 1 ].gradeYearScaleScoreRanges[ j ] != null
        ? areas[ i - 1 ].gradeYearScaleScoreRanges[ j ].scaleScoreRange.maximum
        : minimumScaleScore + 10 * j + 25 * Math.random();

      const gradeYear = yearsAndGrades[ j ];
      area.push({
        gradeYear: gradeYear,
        scaleScoreRange: {
          minimum: previous,
          maximum: previous + 125 + 50 * Math.random()
        }
      });
    }
    areas.push({
      level: i + 1,
      gradeYearScaleScoreRanges: area
    });
  }
  return areas;
}

function createLines(count: number, yearsAndGrades: YearGrade[], scaleScoreRange: number[]): OrganizationPerformance[] {
  const [ minimumScaleScore, maximumScaleScore ] = scaleScoreRange;
  const spread = maximumScaleScore - minimumScaleScore;
  const lines = [];
  for (let i = 0; i < count; i++) {
    const line = [];
    for (let j = 0; j < yearsAndGrades.length; j++) {
      const gradeYear = yearsAndGrades[ j ];

      const previous = lines[ i - 1 ] != null
      && lines[ i - 1 ].gradeYearScaleScores != null
      && lines[ i - 1 ].gradeYearScaleScores[ j ] != null
        ? lines[ i - 1 ].gradeYearScaleScores[ j ].scaleScore
        : minimumScaleScore + spread * 0.2 + spread * 0.02 * j + spread * 0.2 * Math.random();

      line.push({
        gradeYear: gradeYear,
        scaleScore: Math.floor(previous + 50 + 25 * Math.random())
      });

    }
    lines.push({
      organization: createOrganization(i + 1),
      gradeYearScaleScores: line,
      visible: true
    });
  }
  return lines;
}

function createOrganization(id: number): Organization {
  const organization = new DefaultSchool();
  organization.id = id;
  organization.name = `School name ${id}`;
  return organization;
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

  // used for performance level text lookup
  @Input()
  assessmentTypeCode: string = 'sum';

  displayConfiguration = {
    outerWidth: 960,
    outerHeight: 480,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    padding: { top: 0, right: 200, bottom: 40, left: 40 },
    domainMargin: { top: 25, right: 0.25, bottom: 25, left: 0.25 },
    tickPadding: 10
  };

  chart: LongitudinalCohortChart;

  // used to render areas, lines and points
  d3area: any;
  d3line: any;
  xScale: (value: number) => number;
  yScale: (value: number) => number;

  constructor(private elementReference: ElementRef,
              private translate: TranslateService,
              private schoolYearPipe: SchoolYearPipe) {
  }

  private get axesContainer(): any {
    return <any>d3.select(
      this.elementReference.nativeElement.querySelector('.axes-container')
    );
  }

  toggleSeries<T>(series: Series<T>): void {
    series.visible = !series.visible;
  }

  ngOnInit(): void {

    const scaleScoreRange = [ 2000, 2800 ];
    const yearsAndGrades = createYearsAndGrades({ year: 2000, grade: 3 }, 10, 1, 4);

    const areas = createAreas(4, yearsAndGrades, scaleScoreRange);
    const lines = createLines(3, yearsAndGrades, scaleScoreRange);

    const {
      outerWidth,
      outerHeight,
      tickPadding,
      margin,
      padding,
      domainMargin
    } = this.displayConfiguration;

    const
      innerWidth = outerWidth - margin.left - margin.right,
      innerHeight = outerHeight - margin.top - margin.bottom,
      width = innerWidth - padding.left - padding.right - tickPadding,
      height = innerHeight - padding.top - padding.bottom - tickPadding;

    const xScale = this.xScale = d3.scaleLinear()
      .range([ 0, width ])
      .domain([ 0 - domainMargin.left, yearsAndGrades.length - 1 + domainMargin.right ]);

    const yScale = this.yScale = d3.scaleLinear()
      .range([ height, 0 ])
      .domain([ scaleScoreRange[ 0 ] - domainMargin.bottom, scaleScoreRange[ 1 ] + domainMargin.top ]);

    this.chart = <LongitudinalCohortChart>{
      scaleScoreRange: <Range<number>>{
        minimum: scaleScoreRange[ 0 ],
        maximum: scaleScoreRange[ 1 ]
      },
      yearGrades: yearsAndGrades,
      assessmentPerformances: areas.map((area, i) => <ChartArea<PerformanceLevel, void>>{
        points: area.gradeYearScaleScoreRanges.map((interval, j) => <ChartAreaPoint<void>>{
          x: j,
          y0: interval.scaleScoreRange.minimum,
          y1: interval.scaleScoreRange.maximum
        }),
        data: area.level,
        styles: `scale-score-area color-${i}`
      }),
      organizationPerformances: lines.map((line, i) => <any>{
        selector: `.series-${i}`,
        styles: `series-${i}`,
        visible: true,
        data: <ChartLine<Organization, DataPoint>>{
          data: line.organization,
          points: line.gradeYearScaleScores.map((scores, j) => <ChartPoint<DataPoint>>{
            x: j,
            y: scores.scaleScore,
            data: <DataPoint>{
              scaleScoreRange: null /* TODO */,
              scaleScore: scores.scaleScore
            },
            styles: `point color-stroke`
          }),
          styles: `scale-score-line color-${i}`
        }
      })
    };

    this.d3area = d3.area<any>()
      .x(({ x }) => xScale(x))
      .y0(({ y0 }) => yScale(y0))
      .y1(({ y1 }) => yScale(y1));

    this.d3line = d3.line<any>()
      .x(({ x }) => xScale(x))
      .y(({ y, y0 }) => yScale(y != null ? y : y0));

    const xAxis = d3.axisBottom(xScale)
      .tickSize(-height)
      .tickPadding(tickPadding)
      .ticks(yearsAndGrades.length)
      .tickValues(yearsAndGrades.map((d, i) => i))
      .tickFormat((d, i) => this.schoolYearPipe.transform(yearsAndGrades[ i ].year));

    const yAxis = d3.axisLeft(yScale)
      .tickSize(-width)
      .tickPadding(tickPadding)
      .tickFormat(d => d);

    const xAxisContainer = this.axesContainer.append('g')
      .classed('x axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    const yAxisContainer = this.axesContainer.append('g')
      .classed('y axis', true)
      .call(yAxis);

    // Correct x axis tick labels

    this.axesContainer.selectAll('.axis.x .tick')
      .append('text')
      .text((d, i) => {
        const grade = yearsAndGrades[ i ].grade.toString();
        const gradeCode = grade.length < 2 ? '0' + grade : grade;
        return this.translate.instant(`common.assessment-grade-label.${gradeCode}`);
      })
      .classed('grade', true)
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'middle');

    // Draw area labels

    // shouldn't need this...
    const d3lineNoScale = d3.line<any>()
      .x(({ x }) => x)
      .y(({ y }) => y);

    const bands = this.axesContainer.append('g')
      .classed(`scale-score-area-labels ${this.areaPallet}`, true)
      .attr('transform', `translate(${width}, 0)`);

    const bandData = computeBands(areas, xScale, yScale);

    const band = bands.selectAll('.scale-score-area-label')
      .data(bandData)
      .enter()
      .append('g')
      .attr('transform', d => `translate(0, ${yScale(d.bracket.y)})`)
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
    bandTitle.attr('transform', d => `translate(10, ${d.bracket.height + bandTitleBounds.height * 0.33})`);

    band.append('path')
      .classed('bracket color-stroke', true)
      .attr('d', d => d3lineNoScale(d.bracket.path));

    const label = band.append('g')
      .classed('label-container', true)
      .attr('transform', d => `translate(5, ${d.bracket.height * 0.5})`);

    const labelPadding = { top: 3, right: 5, bottom: 3, left: 3 };
    const labelBorderRadius = (labelPadding.top + labelPadding.left) * 0.25; // proportional to height and width

    const labelRect = label.append('rect')
      .classed('color-fill', true)
      .attr('rx', labelBorderRadius)
      .attr('ry', labelBorderRadius);

    const labelText = label.append('text')
      .classed('label-text', true)
      .text((d, i) => this.translate.instant(`common.assessment-type.${this.assessmentTypeCode}.performance-level.${i + 1}.name-prefix`));

    const labelTextBounds = labelText._groups[ 0 ].map(a => a.getBBox());
    // 0.33 is a magic number, translate y should be 0 with alignment middle...
    labelText.attr('transform', (d, i) => `translate(${labelPadding.left}, ${labelTextBounds[ i ].height * 0.33})`);

    labelRect.attr('y', (d, i) => -(labelTextBounds[ i ].height + labelPadding.top + labelPadding.bottom) * 0.5)
      .attr('width', (d, i) => labelTextBounds[ i ].width + labelPadding.left + labelPadding.right)
      .attr('height', (d, i) => labelTextBounds[ i ].height + labelPadding.top + labelPadding.bottom);

  }

}
