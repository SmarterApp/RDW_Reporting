import { Component, Input } from "@angular/core";
import { Percentile } from "./assessment-percentile";
import { Observable } from "rxjs/Observable";
import { Utils } from "../../shared/support/support";

@Component({
  selector: 'assessment-percentile-button',
  templateUrl: 'assessment-percentile-button.component.html'
})
export class AssessmentPercentileButton {

  @Input()
  percentileSource: Observable<Percentile[]>;

  @Input()
  placement: string = 'top';

  percentiles: Percentile[];

  ngOnInit(): void {
    if (Utils.isNullOrUndefined(this.percentileSource)) {
      throw new Error('AssessmentPercentileButton percentileSource is required');
    }
  }

  onClickInternal(): void {
    // if (Utils.isNullOrUndefined(this.percentiles)) {
      this.percentileSource.subscribe(percentiles => this.percentiles = percentiles);
    // }
  }

}
