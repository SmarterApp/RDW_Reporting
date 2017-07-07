import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { AssessmentItem } from "../model/assessment-item.model";
import { TabsetComponent } from "ngx-bootstrap";

@Component({
  selector: 'item-tab',
  templateUrl: './item-tab.component.html'
})
export class ItemTabComponent implements OnInit {
  /**
   * The assessment item to show in this tab.
   */
  @Input()
  item: AssessmentItem;

  /**
   * Should show item details such as the Item Viewer, Exemplar, and Item Info.
   * Typically this should be false if the assessment type is Summative.
   */
  @Input()
  showItemDetails: boolean;

  @ViewChild('staticTabs')
  staticTabs: TabsetComponent;

  get translateRoot(){
    return 'labels.assessments.items.tabs.';
  }

  constructor() { }

  ngOnInit() {
  }

}
