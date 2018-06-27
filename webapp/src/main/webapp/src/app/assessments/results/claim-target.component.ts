import { Component, Input } from "@angular/core";
import { ItemInfoService } from "../items/item-info/item-info.service";
import { AssessmentItem } from "../model/assessment-item.model";

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

  @Input()
  subject: string;

  target: string;

  constructor(private service: ItemInfoService) {
  }

}
