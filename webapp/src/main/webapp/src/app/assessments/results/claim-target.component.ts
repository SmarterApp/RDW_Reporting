import { Component, Input } from "@angular/core";
import { ItemInfoService } from "../items/item-info/item-info.service";
import { AssessmentItem } from "../model/assessment-item.model";
import { Utils } from "@sbac/rdw-reporting-common-ngx";

/**
 * This component is responsible for displaying a label with
 * an information popover icon.
 */
@Component({
  selector: 'claim-target',
  templateUrl: './claim-target.component.html'
})
export class ClaimTargetComponent {

  @Input()
  item: AssessmentItem;

  target: string;

  constructor(private service: ItemInfoService) {
  }

  loadTargetDescription(): void {
    if (Utils.isNullOrUndefined(this.target)) {
      this.service.getTargetDescription(this.item.targetId)
        .subscribe(target => {
          this.target = target;
        });
    }
  }

}
