import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../groups/group';
import { MeasuredAssessment } from './measured-assessment';

@Component({
  selector: 'iab-card',
  templateUrl: './iab-card.component.html'
})
export class IabCardComponent {

  @Input()
  measuredAssessment: MeasuredAssessment;
  selected = false;

  @Input()
  group: Group;

  constructor(private route: ActivatedRoute) {
    // this.group = this.route.snapshot.data[ 'group' ];
  }

  get studentCountFill(): number {
    return Math.min(Math.round((this.measuredAssessment.studentsTested / this.group.totalStudentCount) * 100), 100);
  }

  percentFill(index: number): number {
    return Math.round((this.measuredAssessment.studentCountByPerformanceLevel[ index ] / this.measuredAssessment.studentsTested) * 100);
  }

  selectCard(): void {
    this.selected = !this.selected;
  }
}
