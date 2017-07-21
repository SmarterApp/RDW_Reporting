import { Component, OnInit, Input } from "@angular/core";
import { AssessmentItem } from "../../model/assessment-item.model";

@Component({
  selector: 'item-info',
  templateUrl: './item-info.component.html'})
export class ItemInfoComponent implements OnInit {

  @Input()
  item: AssessmentItem;

  constructor() { }

  ngOnInit() {
  }

}
