import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Output()
  selectedIab: EventEmitter<IabEvent> = new EventEmitter();

  @Input()
  group: Group;

  constructor() {
  }

  get studentCountFill(): number {
    return Math.min(Math.round((this.measuredAssessment.studentsTested / this.group.totalStudentCount) * 100), 100);
  }

  percentFill(index: number): number {
    return Math.round((this.measuredAssessment.studentCountByPerformanceLevel[ index ] / this.measuredAssessment.studentsTested) * 100);
  }

  selectCard(): void {
    this.selected = !this.selected;
    this.selectedIab.emit(<IabEvent>{
      id: this.measuredAssessment.assessment.id,
      selected: this.selected
    });
  }
}

export interface IabEvent {
  readonly id: number;
  readonly selected: boolean;
}
