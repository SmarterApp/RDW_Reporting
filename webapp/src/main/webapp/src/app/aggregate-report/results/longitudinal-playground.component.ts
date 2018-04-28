import { Component } from '@angular/core';
import { LongitudinalCohortChartMapper } from './longitudinal-cohort-chart.mapper';
import { LongitudinalCohortChart } from './longitudinal-cohort-chart';

@Component({
  selector: 'longitudinal-playground',
  template: `
    <div class="well">
      <longitudinal-cohort-chart [chart]="chart"></longitudinal-cohort-chart>
    </div>
  `
})
export class LongitudinalPlaygroundComponent {

  chart: LongitudinalCohortChart;

  constructor(mapper: LongitudinalCohortChartMapper) {
    this.chart = mapper.createStubChart();
  }

}
