import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DefaultSchool, Organization } from '../../shared/organization/organization';
import { SchoolYearPipe } from '../../shared/format/school-year.pipe';
import { select } from 'd3-selection';
import { area, line } from 'd3-shape';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear } from 'd3-scale';

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
  readonly selector: string;
  visible: boolean;
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
      const h = yScale(area.scaleScoreRange.maximum) - yScale(area.scaleScoreRange.minimum);
      // const h = Math.abs( yScale(area.scaleScoreRange.maximum) - yScale(area.scaleScoreRange.minimum) );
      const m = { x: 5, y: -2 };

      return Object.assign({
        bracket: {
          path: [
            { x: 0, y: m.y },
            { x: m.x, y: m.y },
            { x: m.x, y: h - m.y },
            { x: 0, y: h - m.y }
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
        scaleScore: previous + 50 + 25 * Math.random()
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

  organizationPerformanceSeries: Series<OrganizationPerformance>[];

  @ViewChild('chartContainer')
  private chartContainer: ElementRef;

  constructor(private translate: TranslateService,
              private schoolYearPipe: SchoolYearPipe) {
  }

  get root(): any {
    return (<any>select(this.chartContainer.nativeElement));
  }

  toggleSeries<T>(series: Series<T>): void {
    series.visible = !series.visible;
    this.root.selectAll(series.selector)
      .classed('hidden', !series.visible);
  }

  ngOnInit(): void {

    const scaleScoreRange = [ 2000, 2800 ];
    const yearsAndGrades = createYearsAndGrades({ year: 2000, grade: 3 }, 10, 1, 4);

    const areas = createAreas(4, yearsAndGrades, scaleScoreRange);
    const lines = createLines(3, yearsAndGrades, scaleScoreRange);

    // set lines
    this.organizationPerformanceSeries = lines.map((line, index) => <any>{
      selector: `.series-${index}`,
      visible: true,
      data: line
    });

    const bounds = this.root.node().getBoundingClientRect(),
      outerWidth = bounds.width,
      outerHeight = bounds.height,
      tickPadding = 10,
      margin = { top: 0, right: 0, bottom: 0, left: 0 },
      padding = { top: 0, right: 200, bottom: 40, left: 40 },
      innerWidth = outerWidth - margin.left - margin.right,
      innerHeight = outerHeight - margin.top - margin.bottom,
      width = innerWidth - padding.left - padding.right - tickPadding,
      height = innerHeight - padding.top - padding.bottom - tickPadding,
      domainMargin = { top: 25, right: 0.25, bottom: 25, left: 0.25 };

    const d3line = line<any>()
      .x(({ x }) => xScale(x))
      .y(({ y }) => yScale(y));

    const d3area = area<any>()
      .x(({ x }) => xScale(x))
      .y0(({ y0 }) => yScale(y0))
      .y1(({ y1 }) => yScale(y1));

    const xScale = scaleLinear()
      .range([ 0, width ])
      .domain([ 0 - domainMargin.left, yearsAndGrades.length - 1 + domainMargin.right ]);

    const yScale = scaleLinear()
      .range([ height, 0 ])
      .domain([ scaleScoreRange[ 0 ] - domainMargin.bottom, scaleScoreRange[ 1 ] + domainMargin.top ]);

    const xAxis = axisBottom(xScale)
      .tickSize(-height)
      .tickPadding(tickPadding)
      .ticks(yearsAndGrades.length)
      .tickValues(yearsAndGrades.map((d, i) => i))
      .tickFormat((d, i) => this.schoolYearPipe.transform(yearsAndGrades[ i ].year));

    const yAxis = axisLeft(yScale)
      .tickSize(-width)
      .tickPadding(tickPadding);

    const svg = this.root
      .attr('height', outerHeight)
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .append('g')
      .attr('transform', `translate(${padding.left}, ${padding.top})`);

    svg.append('g')
      .classed('x axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    svg.append('g')
      .classed('y axis', true)
      .call(yAxis);

    // Draw areas

    const performanceLevelArea = svg.append('g')
      .classed(`scale-score-areas ${this.areaPallet}`, true)
      .selectAll('.scale-score-area')
      .data(areas)
      .enter()
      .append('g')
      .attr('class', (d, i) => `scale-score-area color-${i}`);

    performanceLevelArea.append('path')
      .classed('color-fill', true)
      .attr('d', d => d3area(d.gradeYearScaleScoreRanges.map(a => <any>{
        x: yearsAndGrades.indexOf(a.gradeYear),
        y0: a.scaleScoreRange.minimum,
        y1: a.scaleScoreRange.maximum
      })));

    performanceLevelArea.append('path')
      .classed('scale-score-area-divider', true)
      .attr('d', d => d3line(d.gradeYearScaleScoreRanges.map(a => <any>{
        x: yearsAndGrades.indexOf(a.gradeYear),
        y: a.scaleScoreRange.maximum
      })));

    // Draw lines

    const performanceLevelTrend = svg.append('g')
      .classed(`scale-score-lines ${this.linePallet}`, true)
      .selectAll('.scale-score-line')
      .data(lines)
      .enter()
      .append('g')
      .attr('class', (d, i) => `scale-score-line series-${i} color-${i}`);

    performanceLevelTrend.append('path')
      .classed('line color-stroke', true)
      .attr('d', d => d3line(d.gradeYearScaleScores.map(a => <any>{
        x: yearsAndGrades.indexOf(a.gradeYear),
        y: a.scaleScore
      })));

    // Draw dots

    performanceLevelTrend.selectAll('circle')
      .data(d => d.gradeYearScaleScores)
      .enter()
      .append('circle')
      .classed('point color-stroke', true)
      .attr('r', 5)
      .attr('cx', d => xScale(yearsAndGrades.indexOf(d.gradeYear)))
      .attr('cy', d => yScale(d.scaleScore))
      .on('mouseover', (d, i, circles) => {
        select(circles[ i ])
          .attr('r', 8);
      })
      .on('mouseout', (d, i, circles) => {
        select(circles[ i ])
          .attr('r', 5);
      })
      .on('click', (d, i, circles) => {

      });

    // Correct x axis tick labels

    svg.selectAll('.axis.x .tick')
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
    const d3lineNoScale = line<any>()
      .x(({ x }) => x)
      .y(({ y }) => y);

    const bands = svg.append('g')
      .classed(`scale-score-area-labels ${this.areaPallet}`, true)
      .attr('transform', `translate(${width}, 0)`);

    const bandData = computeBands(areas, xScale, yScale);

    const band = bands.selectAll('.scale-score-area-label')
      .data(bandData)
      .enter()
      .append('g')
      .attr('transform', d => `translate(0, ${yScale(d.scaleScoreRange.minimum)})`)
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
    bandTitle.attr('transform', d => `translate(10, ${(yScale(d.scaleScoreRange.maximum) - yScale(d.scaleScoreRange.minimum)) + bandTitleBounds.height * 0.33})`);

    band.append('path')
      .classed('bracket color-stroke', true)
      .attr('d', d => d3lineNoScale(d.bracket.path));

    const label = band.append('g')
      .classed('label-container', true)
      .attr('transform', d => `translate(5, ${(yScale(d.scaleScoreRange.maximum) - yScale(d.scaleScoreRange.minimum)) * 0.5})`);

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
