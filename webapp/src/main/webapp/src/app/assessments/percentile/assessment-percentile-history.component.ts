import { Component, Input } from "@angular/core";
import { PercentileGroup } from "./assessment-percentile";

@Component({
  selector: 'assessment-percentile-history',
  templateUrl: 'assessment-percentile-history.component.html',
  host: {
    'class': 'assessment-percentile-history'
  }
})
export class AssessmentPercentileHistoryComponent {

  @Input()
  percentileGroups: PercentileGroup[];

}
