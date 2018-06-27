import { Component, Input, OnInit } from "@angular/core";
import { AssessmentItem } from "../../model/assessment-item.model";
import { ItemInfoService } from "./item-info.service";

@Component({
  selector: 'item-info',
  templateUrl: './item-info.component.html'
})
export class ItemInfoComponent implements OnInit {

  @Input()
  item: AssessmentItem;

  @Input()
  subject: string;

  interpretiveGuideUrl: string;

  constructor(private service: ItemInfoService) {
  }

  ngOnInit() {
    this.service
      .getInterpretiveGuide()
      .subscribe(guide => this.interpretiveGuideUrl = guide);
  }

}
